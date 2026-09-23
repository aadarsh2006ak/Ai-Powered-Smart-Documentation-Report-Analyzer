const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Get all subscription plans
router.get('/plans', (req, res) => {
  res.status(200).json({
    success: true,
    data: stripeService.getPlans(),
  });
});

// Create Stripe Checkout Session
router.post('/create-checkout-session', protect, async (req, res, next) => {
  try {
    const returnUrl = req.body.returnUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`;
    const session = await stripeService.createCheckoutSession(req.user._id, req.user.email, returnUrl);

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.sessionId,
    });
  } catch (error) {
    next(error);
  }
});

// Upgrade user tier (Simulated or via webhook)
router.post('/upgrade-tier', protect, async (req, res, next) => {
  try {
    const { tier = 'pro' } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { role: tier === 'pro' ? 'admin' : 'user' } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Account successfully upgraded to ${tier.toUpperCase()}`,
      user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
