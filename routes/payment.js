const express = require('express');
const router = express.Router();

// Mock payment verification
router.post('/verify', (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  // In production, verify with Razorpay/Stripe
  // For demo, always success

  res.json({
    success: true,
    message: 'Payment verified',
    plan: 'pro',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
});

// Get plans
router.get('/plans', (req, res) => {
  res.json([
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['1 chatbot', '100 chats/month', 'Basic analytics'],
      button: 'Get Started'
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 999,
      period: 'month',
      features: ['5 chatbots', '10,000 chats/month', 'Export data', 'Email support'],
      button: 'Subscribe'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 2999,
      period: 'month',
      features: ['25 chatbots', 'Unlimited chats', 'White-label', 'Priority support', 'API access'],
      button: 'Subscribe',
      popular: true
    }
  ]);
});

module.exports = router;
