const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const getRedisConnection = () => {
  if (redisClient) return redisClient;

  try {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      const isSecure = redisUrl.startsWith('rediss://') || redisUrl.includes('upstash.io');
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
        tls: isSecure ? { rejectUnauthorized: false } : undefined,
        retryStrategy(times) {
          if (times > 3) {
            logger.warn('Redis unreachable after 3 attempts. Utilizing async in-process fallback.');
            return null;
          }
          return Math.min(times * 300, 1000);
        },
      });
    } else {
      const isUpstash = (process.env.REDIS_HOST || '').includes('upstash.io');
      const redisOptions = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        tls: isUpstash || process.env.REDIS_TLS === 'true' ? { rejectUnauthorized: false } : undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
        retryStrategy(times) {
          if (times > 3) {
            logger.warn('Redis unreachable after 3 attempts. Utilizing async in-process fallback.');
            return null;
          }
          return Math.min(times * 300, 1000);
        },
      };

      redisClient = new Redis(redisOptions);
    }

    redisClient.on('connect', () => {
      logger.success('Redis Client Connected Successfully');
    });

    redisClient.on('error', (err) => {
      // Don't flood logs with connection errors in dev/test
      if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
        logger.warn(`Redis not available (${err.code}). In-memory async worker is active.`);
      } else {
        logger.warn(`Redis Connection Notice: ${err.message}`);
      }
    });

    return redisClient;
  } catch (error) {
    logger.warn(`Redis init error: ${error.message}`);
    return null;
  }
};

const closeRedisConnection = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (e) {
      redisClient.disconnect();
    }
    redisClient = null;
  }
};

module.exports = { getRedisConnection, closeRedisConnection };
