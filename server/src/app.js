const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Middlewares
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reportRoutes = require('./routes/reportRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const billingRoutes = require('./routes/billingRoutes');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const clientEnvUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/+$/, ''))
  : [];

const allowedOrigins = [
  ...clientEnvUrls,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.onrender.com') ||
        normalizedOrigin.endsWith('.vercel.app') ||
        process.env.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
  })
);

const { authLimiter, aiLimiter, globalLimiter } = require('./middleware/rateLimitMiddleware');

// Request Rate Limiting
app.use('/api', globalLimiter);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request Logging in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Smart Document & Report Analyzer Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes with specialized rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/upload', aiLimiter, uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/billing', billingRoutes);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
