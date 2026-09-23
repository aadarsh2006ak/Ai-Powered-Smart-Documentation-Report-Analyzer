const Report = require('../models/Report');
const User = require('../models/User');
const extractionService = require('../services/extractionService');
const aiAnalyzerService = require('../services/aiAnalyzerService');
const logger = require('../utils/logger');

/**
 * Process a document analysis job
 * @param {Object} jobData - { reportId, fileUrl, fileType, category, fileBuffer }
 */
const processDocumentJob = async (jobData) => {
  const { reportId, fileType, category, fileBuffer, text } = jobData;
  const startTime = Date.now();

  logger.info(`[Queue Worker] Starting processing for Report: ${reportId}`);

  try {
    // 1. Fetch report
    const report = await Report.findById(reportId);
    if (!report) {
      throw new Error(`Report not found with ID: ${reportId}`);
    }

    // 2. Extract text if not provided in jobData or report
    let extractedText = text || report.extractedText;
    if (!extractedText || extractedText.trim().length === 0) {
      if (fileBuffer) {
        logger.info(`[Pipeline Worker] Extracting text from buffer (${fileType})...`);
        const extraction = await extractionService.extractText(fileBuffer, fileType);
        extractedText = extraction.extractedText;
      } else if (report.originalFile?.fileName) {
        extractedText = `Document Content for ${report.originalFile.fileName}.`;
      }
    }

    const cacheService = require('../services/cacheService');
    const emailService = require('../services/emailService');
    const contentHash = report.originalFile?.contentHash || jobData.contentHash;
    const docCategory = category || report.documentCategory || 'general';

    // 3. Fast-Path L1/L2 Cache Check
    let insights = null;
    let isCached = false;

    if (contentHash) {
      const cached = await cacheService.getCachedInsights(contentHash, docCategory);
      if (cached) {
        insights = cached;
        isCached = true;
        logger.success(`[Pipeline Worker] ⚡ Instant Cache Hit for Report: ${reportId}`);
      }
    }

    // 4. Run AI Document Analysis if not in cache
    if (!insights) {
      logger.info(`[Pipeline Worker] Analyzing text (${extractedText.length} chars) with Groq LPU Engine...`);
      insights = await aiAnalyzerService.analyzeDocument(extractedText, docCategory);

      // Store in L1+L2 Cache
      if (contentHash) {
        await cacheService.setCachedInsights(contentHash, docCategory, insights);
      }
    }

    // 5. Update Report in a single atomic DB write
    const duration = Date.now() - startTime;
    report.extractedText = extractedText;
    report.aiInsights = insights;
    report.isCachedResult = isCached;
    report.status = 'done';
    report.processingTimeMs = duration;
    report.telemetry = insights.telemetry || {
      provider: isCached ? 'L1 Process RAM' : 'Groq Cloud LPU',
      modelUsed: isCached ? 'cache-sha256' : 'qwen/qwen3.8-27b',
      promptTokens: isCached ? 0 : Math.round(extractedText.length / 4),
      completionTokens: isCached ? 0 : 350,
      totalTokens: isCached ? 0 : Math.round(extractedText.length / 4) + 350,
      inferenceLatencyMs: isCached ? 1 : duration,
      tokenSavingsPercent: isCached ? 100 : 0,
    };
    await report.save();

    // 6. Update user usage metrics asynchronously
    if (report.user) {
      User.findByIdAndUpdate(
        report.user,
        {
          $inc: { 'usage.documentsAnalyzed': 1 },
          $set: { 'usage.lastAnalysisAt': new Date() },
        },
        { new: true }
      ).catch(() => {});

      User.findById(report.user).then((u) => {
        if (u && u.email) {
          emailService.sendReportReadyEmail(u.email, u.name, report).catch(() => {});
        }
      }).catch(() => {});
    }

    logger.success(
      `[Pipeline Worker] ✅ Finished Report: ${reportId} in ${duration}ms [Status: done, Cached: ${isCached}]`
    );
    return { success: true, reportId, duration };
  } catch (err) {
    logger.error(`[Pipeline Worker] Job failed for Report ${reportId}:`, err.message);
    await Report.findByIdAndUpdate(reportId, {
      status: 'failed',
      errorMessage: err.message,
    });
    throw err;
  }
};

module.exports = {
  processDocumentJob,
};
