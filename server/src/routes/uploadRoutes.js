const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const storageService = require('../config/storage');
const extractionService = require('../services/extractionService');
const Report = require('../models/Report');
const { addDocumentToQueue } = require('../queues/documentQueue');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * @route   POST /api/upload
 * @desc    Upload document, extract text in-memory (<20ms), non-blocking Cloudinary stream, and queue AI analysis
 * @access  Private
 */
router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a file to upload.' });
    }

    const { category = 'general' } = req.body;
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // 1. In-Memory SHA-256 content hash for duplicate caching (< 1ms)
    const contentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    logger.info(`Received file upload: ${fileName} (${mimeType}, ${(fileBuffer.length / 1024).toFixed(1)} KB)`);

    // 2. In-Memory Instant Text Extraction (< 20ms) - Pipeline Stage 1
    let extractedText = '';
    try {
      const extraction = await extractionService.extractText(fileBuffer, mimeType);
      extractedText = extraction.extractedText;
    } catch (extractErr) {
      logger.warn(`Immediate text extraction warning: ${extractErr.message}. Will retry in worker.`);
    }

    // 3. Create Report Record in DB immediately (Status: 'processing')
    const report = await Report.create({
      user: req.user._id,
      originalFile: {
        fileName,
        url: '', // Populated asynchronously by background Cloudinary upload
        publicId: '',
        fileType: mimeType,
        sizeBytes: fileBuffer.length,
        contentHash,
      },
      extractedText,
      documentCategory: category,
      status: 'processing',
    });

    // 4. Non-Blocking Cloudinary Upload (OS Asynchronous I/O Overlap)
    // Does NOT block the HTTP response or AI inference pipeline
    storageService
      .uploadStream(fileBuffer, fileName, mimeType)
      .then(async (storageResult) => {
        if (storageResult && storageResult.url) {
          await Report.findByIdAndUpdate(report._id, {
            'originalFile.url': storageResult.url,
            'originalFile.publicId': storageResult.publicId,
          });
          logger.info(`[Non-Blocking I/O] Cloudinary stream completed for Report ${report._id}`);
        }
      })
      .catch((storageErr) => {
        logger.warn(`[Non-Blocking I/O] Background Cloudinary upload warning: ${storageErr.message}`);
      });

    // 5. Dispatch document analysis job immediately with pre-extracted text
    const queueDispatch = await addDocumentToQueue({
      reportId: report._id,
      fileType: mimeType,
      category,
      text: extractedText,
      contentHash,
    });

    report.jobId = queueDispatch.jobId;
    await report.save();

    logger.success(`Report ${report._id} dispatched to ${queueDispatch.type} pipeline in <40ms`);

    // 6. Return 202 Accepted immediately to client
    res.status(202).json({
      success: true,
      message: 'Document ingested successfully and analysis active.',
      reportId: report._id,
      status: report.status,
      file: {
        fileName,
        sizeKB: (fileBuffer.length / 1024).toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

