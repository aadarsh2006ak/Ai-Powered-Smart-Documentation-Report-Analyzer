const User = require('../models/User');
const { RegisterSchema, LoginSchema } = require('../schemas/insightSchema');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Cookie options for secure token storage
const getCookieOptions = () => ({
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

// Helper: send response with token and cookie
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  // Save refresh token to user record
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res
    .status(statusCode)
    .cookie('token', token, getCookieOptions())
    .json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        usage: user.usage,
      },
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);

    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    });

    logger.info(`New user registered: ${user.email}`);
    await sendTokenResponse(user, 201, res);
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const validatedData = LoginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(validatedData.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    logger.info(`User logged in: ${user.email}`);
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_dev'
    );

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const newAccessToken = user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
  }
};

/**
 * @desc    Log user out / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

/**
 * @desc    Instant Demo Login for portfolio reviewers and automated onboarding
 * @route   POST /api/auth/demo
 * @access  Public
 */
const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'demo@smartdoc.ai';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Demo Enterprise Analyst',
        email: demoEmail,
        password: 'DemoPassword123!',
        role: 'user',
      });
      logger.info('Created new default Demo User account: demo@smartdoc.ai');
    }

    // Check if demo user has reports, if 0, auto-seed the 6 sample documents
    const Report = require('../models/Report');
    const existingReportsCount = await Report.countDocuments({ user: user._id });
    if (existingReportsCount === 0) {
      // Auto seed
      const { seedSampleReports } = require('./reportController');
      // Create a mock req/res for internal invocation
      const mockReq = { user: { _id: user._id } };
      const mockRes = { status: () => ({ json: () => {} }) };
      const mockNext = (err) => { if (err) logger.warn(`Demo auto-seed error: ${err.message}`); };
      await seedSampleReports(mockReq, mockRes, mockNext);
    }

    logger.info(`Demo user authenticated: ${user.email}`);
    await sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  demoLogin,
  getMe,
  refreshToken,
  logout,
};
