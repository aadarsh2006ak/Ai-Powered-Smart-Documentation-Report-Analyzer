const { getRedisConnection } = require('../config/redis');
const logger = require('../utils/logger');

const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 Days
const l1MemoryCache = new Map(); // Tier 1: Local process RAM (< 0.1ms access)

/**
 * Two-Tier (L1 Process RAM + L2 Distributed Redis) Content-Hash Caching Service
 * Reduces redundant LLM token costs and achieves < 1ms response on duplicate documents.
 */
const cacheService = {
  /**
   * Build cache key from content hash and category
   */
  getCacheKey: (contentHash, category = 'general') => {
    return `doc_cache:${contentHash}:${category.toLowerCase()}`;
  },

  /**
   * Retrieve cached insights by content hash (L1 Memory first, then L2 Redis)
   */
  getCachedInsights: async (contentHash, category = 'general') => {
    if (!contentHash) return null;

    const key = cacheService.getCacheKey(contentHash, category);

    // 1. Tier 1: In-Memory RAM Cache (< 0.1ms)
    if (l1MemoryCache.has(key)) {
      logger.info(`⚡ [L1 Cache Hit - RAM] Instant retrieval for hash: ${contentHash.slice(0, 12)}...`);
      return l1MemoryCache.get(key);
    }

    // 2. Tier 2: Remote Redis Cache (< 15ms)
    const redis = getRedisConnection();
    try {
      if (redis && redis.status === 'ready') {
        const cachedStr = await redis.get(key);
        if (cachedStr) {
          const parsed = JSON.parse(cachedStr);
          // Populate L1 cache for subsequent requests
          l1MemoryCache.set(key, parsed);
          logger.info(`⚡ [L2 Cache Hit - Redis] Found cached AI insights for hash: ${contentHash.slice(0, 12)}...`);
          return parsed;
        }
      }
    } catch (err) {
      logger.warn(`Cache read error for key ${key}: ${err.message}`);
    }

    return null;
  },

  /**
   * Save validated AI insights to both L1 (RAM) and L2 (Redis)
   */
  setCachedInsights: async (contentHash, category = 'general', insights) => {
    if (!contentHash || !insights) return;

    const key = cacheService.getCacheKey(contentHash, category);

    // Save to L1 Memory Cache
    l1MemoryCache.set(key, insights);

    // Save to L2 Redis Cache
    const redis = getRedisConnection();
    try {
      if (redis && redis.status === 'ready') {
        const serialized = JSON.stringify(insights);
        await redis.setex(key, CACHE_TTL_SECONDS, serialized);
        logger.info(`💾 [Cache Stored - L1+L2] Cached AI insights for hash: ${contentHash.slice(0, 12)}...`);
      }
    } catch (err) {
      logger.warn(`Cache write error for key ${key}: ${err.message}`);
    }
  },

  /**
   * Invalidate cached document insights
   */
  invalidateCache: async (contentHash, category = 'general') => {
    const key = cacheService.getCacheKey(contentHash, category);
    l1MemoryCache.delete(key);

    const redis = getRedisConnection();
    try {
      if (redis && redis.status === 'ready') {
        await redis.del(key);
      }
      logger.info(`Cache invalidated for key: ${key}`);
    } catch (err) {
      logger.warn(`Cache delete error for key ${key}: ${err.message}`);
    }
  },
};

module.exports = cacheService;

