const rateLimit = require('express-rate-limit');
const isDev = process.env.NODE_ENV === 'development';

/**
 * Authentication Rate Limiter (Brute-Force Protection)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 50, // Limit each IP to 50 login/register requests per 15 min in prod
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after a few minutes.',
  },
  skip: () => isDev,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * AI Processing & Upload Rate Limiter (API Quota & Cost Protection)
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 150, // Limit each IP to 150 uploads per 15 min
  message: {
    success: false,
    message: 'AI processing quota limit reached for this window. Please wait a few moments.',
  },
  skip: () => isDev,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Global General Read API Limiter (Generous for live polling & UI telemetry)
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 3000, // 3000 requests per 15 min window for smooth polling
  message: {
    success: false,
    message: 'Too many API requests, please slow down.',
  },
  skip: (req) => isDev || req.path === '/health',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  aiLimiter,
  globalLimiter,
};
