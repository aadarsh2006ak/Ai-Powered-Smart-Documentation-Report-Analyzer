const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const XLSX = require('xlsx');
const { cleanExtractedText, estimateTokenCount } = require('../utils/textCleaner');
const { chunkDocument } = require('../utils/chunker');
const logger = require('../utils/logger');

/**
 * Multi-Format Document Extraction Service
 */
const extractionService = {
  /**
   * Extract text from PDF buffer
   */
  extractFromPdf: async (buffer) => {
    try {
      logger.info('Extracting text from PDF buffer...');
      const data = await pdfParse(buffer);
      const rawText = data.text || '';
      return {
        text: rawText,
        pageCount: data.numpages || 1,
        meta: data.info || {},
      };
    } catch (err) {
      logger.error('PDF extraction failed:', err.message);
      throw new Error(`PDF parsing failed: ${err.message}`);
    }
  },

  /**
   * Extract text from Excel spreadsheets (.xlsx, .xls, .csv)
   */
  extractFromExcel: (buffer) => {
    try {
      logger.info('Extracting structured table data from Excel/CSV workbook...');
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetTexts = [];

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        // Convert to readable CSV format
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        if (csv && csv.trim().length > 0) {
          sheetTexts.push(`--- SHEET: ${sheetName} ---\n${csv}`);
        }
      });

      const fullText = sheetTexts.join('\n\n');
      return {
        text: fullText || 'Empty spreadsheet with no cell data.',
        pageCount: workbook.SheetNames.length || 1,
        meta: { sheetCount: workbook.SheetNames.length, sheets: workbook.SheetNames },
      };
    } catch (err) {
      logger.error('Excel extraction failed:', err.message);
      throw new Error(`Excel parsing failed: ${err.message}`);
    }
  },

  /**
   * Extract text from DOCX / DOC buffer
   */
  extractFromDocx: async (buffer) => {
    try {
      logger.info('Extracting text from DOCX buffer with mammoth...');
      const result = await mammoth.extractRawText({ buffer });
      return {
        text: result.value || '',
        pageCount: 1,
        meta: { warnings: result.messages || [] },
      };
    } catch (err) {
      logger.error('DOCX extraction failed:', err.message);
      throw new Error(`DOCX parsing failed: ${err.message}`);
    }
  },

  /**
   * Extract text from Image buffer using Tesseract OCR
   */
  extractFromImage: async (buffer, language = 'eng') => {
    try {
      logger.info(`Running Tesseract.js OCR on image buffer (Language: ${language})...`);
      const { data } = await Tesseract.recognize(buffer, language, {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress % 0.25 === 0) {
            logger.info(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      return {
        text: data.text || '',
        pageCount: 1,
        meta: { confidence: data.confidence },
      };
    } catch (err) {
      logger.error('Tesseract OCR failed:', err.message);
      throw new Error(`OCR extraction failed: ${err.message}`);
    }
  },

  /**
   * Extract text from Plain text / markdown buffer
   */
  extractFromPlainText: (buffer) => {
    return {
      text: buffer.toString('utf-8'),
      pageCount: 1,
      meta: {},
    };
  },

  /**
   * Unified Extraction Pipeline for any supported MIME type
   * @param {Buffer} buffer - File buffer
   * @param {string} mimeType - File MIME type
   * @returns {Promise<{ extractedText: string, charCount: number, estimatedTokens: number, chunks: Array, pageCount: number }>}
   */
  extractText: async (buffer, mimeType) => {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid file buffer provided for extraction');
    }

    let extractionResult = { text: '', pageCount: 1, meta: {} };

    // Route according to MIME type
    if (mimeType === 'application/pdf') {
      extractionResult = await extractionService.extractFromPdf(buffer);

      // Scanned PDF fallback: if PDF contains almost no text, attempt OCR
      if (extractionResult.text.trim().length < 50) {
        logger.warn('PDF has negligible selectable text. Document may be a scanned image PDF.');
      }
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'text/csv' ||
      mimeType === 'application/csv'
    ) {
      extractionResult = extractionService.extractFromExcel(buffer);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      extractionResult = await extractionService.extractFromDocx(buffer);
    } else if (mimeType.startsWith('image/')) {
      extractionResult = await extractionService.extractFromImage(buffer);
    } else if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      extractionResult = extractionService.extractFromPlainText(buffer);
    } else {
      // Fallback: Attempt excel parse first if it has spreadsheet characteristics or text
      try {
        extractionResult = extractionService.extractFromExcel(buffer);
      } catch {
        extractionResult = extractionService.extractFromPlainText(buffer);
      }
    }

    // Clean & normalize the extracted text
    const cleanedText = cleanExtractedText(extractionResult.text);
    const charCount = cleanedText.length;
    const estimatedTokens = estimateTokenCount(cleanedText);

    // Generate semantic chunks for LLM processing
    const chunks = chunkDocument(cleanedText);

    logger.success(
      `Text extraction completed: ${charCount} chars, ~${estimatedTokens} tokens, ${chunks.length} chunk(s)`
    );

    return {
      extractedText: cleanedText,
      charCount,
      estimatedTokens,
      chunks,
      pageCount: extractionResult.pageCount || 1,
      meta: extractionResult.meta || {},
    };
  },
};

module.exports = extractionService;
