/**
 * Structured Logger Utility
 */
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

const formatTime = () => new Date().toISOString();

const logger = {
  info: (msg, meta = '') => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${colors.dim}${formatTime()}${colors.reset} - ${msg}`, meta);
  },
  success: (msg, meta = '') => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.dim}${formatTime()}${colors.reset} - ${msg}`, meta);
  },
  warn: (msg, meta = '') => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.dim}${formatTime()}${colors.reset} - ${msg}`, meta);
  },
  error: (msg, err = '') => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${colors.dim}${formatTime()}${colors.reset} - ${msg}`, err);
  },
  ai: (msg, meta = '') => {
    console.log(`${colors.magenta}[AI-ENGINE]${colors.reset} ${colors.dim}${formatTime()}${colors.reset} - ${msg}`, meta);
  },
};

module.exports = logger;
