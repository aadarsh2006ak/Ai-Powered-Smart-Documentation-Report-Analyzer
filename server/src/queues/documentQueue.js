const { Queue, Worker } = require('bullmq');
const { getRedisConnection } = require('../config/redis');
const { processDocumentJob } = require('../workers/documentWorker');
const logger = require('../utils/logger');

const QUEUE_NAME = 'document-analysis-queue';

let analysisQueue = null;
let analysisWorker = null;
let isRedisAvailable = false;

// Attempt to initialize BullMQ with Redis
const redisConn = getRedisConnection();

if (redisConn) {
  try {
    const queueConnection = {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    };

    analysisQueue = new Queue(QUEUE_NAME, {
      connection: queueConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 86400 },
      },
    });

    analysisWorker = new Worker(
      QUEUE_NAME,
      async (job) => {
        logger.info(`[BullMQ Worker] Processing Job ${job.id} for Report ${job.data.reportId}`);
        return await processDocumentJob(job.data);
      },
      {
        connection: queueConnection,
        concurrency: 5,
      }
    );

    analysisWorker.on('completed', (job) => {
      logger.success(`[BullMQ Worker] Job ${job.id} completed successfully`);
    });

    analysisWorker.on('failed', (job, err) => {
      logger.error(`[BullMQ Worker] Job ${job?.id} failed:`, err.message);
    });

    isRedisAvailable = true;
    logger.info('BullMQ Document Analysis Queue & Worker Initialized');
  } catch (err) {
    logger.warn(`BullMQ init failed: ${err.message}. Using asynchronous in-process queue fallback.`);
    isRedisAvailable = false;
  }
}

/**
 * Dispatch document analysis job to queue with immediate non-blocking fast-path
 */
const addDocumentToQueue = async (jobData) => {
  const cleanJobData = {
    reportId: jobData.reportId,
    fileType: jobData.fileType,
    category: jobData.category,
    text: jobData.text,
    contentHash: jobData.contentHash,
  };

  // 1. Fast-Path: Launch asynchronous in-process execution immediately (< 1ms)
  setImmediate(async () => {
    try {
      await processDocumentJob(cleanJobData);
    } catch (err) {
      logger.error(`In-process async processing error for ${jobData.reportId}:`, err.message);
    }
  });

  // 2. Queue Persistence in BullMQ if available (background guarantee)
  if (isRedisAvailable && analysisQueue) {
    analysisQueue.add('analyze-doc', cleanJobData).catch((err) => {
      logger.warn(`BullMQ queue background push notice: ${err.message}`);
    });
  }

  return { queued: true, jobId: `fast_${Date.now()}`, type: 'in-process-pipeline' };
};

const closeQueueWorker = async () => {
  if (analysisWorker) {
    try {
      await analysisWorker.close();
    } catch (e) {}
  }
  if (analysisQueue) {
    try {
      await analysisQueue.close();
    } catch (e) {}
  }
};

module.exports = {
  analysisQueue,
  analysisWorker,
  addDocumentToQueue,
  closeQueueWorker,
};
