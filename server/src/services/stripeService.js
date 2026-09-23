const logger = require('../utils/logger');
let stripe = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  logger.info('Stripe Billing Client Initialized');
} else {
  logger.info('Stripe credentials not provided. Using SaaS Monetization Simulator.');
}

const PLANS = {
  free: {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    monthlyDocLimit: 5,
    features: ['5 Documents/month', 'Standard Risk Scoring', 'PDF Export'],
  },
  pro: {
    id: 'pro',
    name: 'Pro Professional',
    price: 29,
    monthlyDocLimit: -1, // Unlimited
    features: [
      'Unlimited Document Processing',
      'Contract Multi-Doc Comparison',
      'Interactive RAG Chat-with-Doc',
      'Team & Workspace Sharing',
      'Priority Gemini 2.0 Flash Queue',
      'Custom White-Label PDF Export',
    ],
  },
};

const stripeService = {
  /**
   * Create Stripe Checkout Session
   */
  createCheckoutSession: async (userId, userEmail, returnUrl) => {
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: userEmail,
        client_reference_id: userId.toString(),
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'SmartDoc AI Pro Subscription',
                description: 'Unlimited Document Processing, RAG Chat, and Contract Comparison',
              },
              unit_amount: 2900, // $29.00
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancel_url: `${returnUrl}?status=cancelled`,
      });

      return { url: session.url, sessionId: session.id };
    }

    // Dev Simulation Fallback
    logger.info(`[Stripe Simulation] Created test checkout session for ${userEmail}`);
    return {
      url: `${returnUrl}?status=success&simulated=true`,
      sessionId: `sim_session_${Date.now()}`,
    };
  },

  getPlans: () => PLANS,
};

module.exports = stripeService;
