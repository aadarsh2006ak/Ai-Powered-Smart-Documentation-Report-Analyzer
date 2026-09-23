require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { getRedisConnection } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Initialize Database & Cache
const startServer = async () => {
  logger.info('Initializing Smart Document & Report Analyzer Services...');

  // Connect to MongoDB
  await connectDB();

  // Initialize Redis Connection & BullMQ Worker
  getRedisConnection();
  require('./queues/documentQueue');

  // Start Express Server
  const server = app.listen(PORT, () => {
    logger.success(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`📡 API Health Check available at http://localhost:${PORT}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use by another running server instance.`);
      logger.info(`To free port ${PORT}, terminate the running process or choose a different PORT in .env`);
      process.exit(1);
    } else {
      logger.error(`Server error: ${err.message}`);
    }
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`, err.stack);
    // Graceful exit
    server.close(() => process.exit(1));
  });

  // Handle SIGTERM signal
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated.');
    });
  });
};

startServer();
