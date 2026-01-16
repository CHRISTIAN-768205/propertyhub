const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// ==========================================
// GET CURRENT SUBSCRIPTION
// ==========================================
router.get('/current', auth, async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ landlord: req.user.id });
    
    if (!subscription) {
      // Create default free subscription
      subscription = await Subscription.create({
        landlord: req.user.id,
        plan: 'free',
        status: 'active'
      });
      console.log('📝 Created default FREE subscription for:', req.user.email);
    }
    
    res.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        commissionRate: subscription.getCommissionRate(),
        isActive: subscription.isActive(),
        amount: subscription.amount,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ==========================================
// UPGRADE TO PREMIUM
// ==========================================
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    
    // Get or create subscription
    let subscription = await Subscription.findOne({ landlord: req.user.id });
    
    if (!subscription) {
      subscription = new Subscription({ landlord: req.user.id });
    }
    
    // Check if already premium
    if (subscription.plan === 'premium' && subscription.isActive()) {
      return res.status(400).json({ 
        success: false,
        message: 'You are already on the Premium plan' 
      });
    }
    
    // Update to premium
    subscription.plan = 'premium';
    subscription.status = 'active';
    subscription.amount = 1000;
    subscription.paymentMethod = paymentMethod || 'mpesa';
    subscription.startDate = new Date();
    subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    subscription.lastPaymentDate = new Date();
    subscription.nextPaymentDate = subscription.endDate;
    subscription.autoRenew = true;
    
    await subscription.save();
    
    // Update user
    const user = await User.findById(req.user.id);
    user.subscription = subscription._id;
    await user.save();
    
    console.log('✅ Upgraded to Premium:', req.user.email);
    
    res.json({
      success: true,
      message: 'Successfully upgraded to Premium!',
      subscription: {
        plan: subscription.plan,
        commissionRate: subscription.getCommissionRate(),
        amount: subscription.amount,
        nextPaymentDate: subscription.nextPaymentDate
      }
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ==========================================
// DOWNGRADE TO FREE
// ==========================================
router.post('/downgrade', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ landlord: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false,
        message: 'Subscription not found' 
      });
    }
    
    if (subscription.plan === 'free') {
      return res.status(400).json({ 
        success: false,
        message: 'You are already on the Free plan' 
      });
    }
    
    // Downgrade
    subscription.plan = 'free';
    subscription.status = 'active';
    subscription.amount = 0;
    subscription.endDate = null;
    subscription.nextPaymentDate = null;
    
    await subscription.save();
    
    console.log('📉 Downgraded to Free:', req.user.email);
    
    res.json({
      success: true,
      message: 'Downgraded to Free plan',
      subscription: {
        plan: subscription.plan,
        commissionRate: subscription.getCommissionRate()
      }
    });
  } catch (error) {
    console.error('Downgrade error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ==========================================
// CANCEL SUBSCRIPTION (Premium → Free at end of period)
// ==========================================
router.post('/cancel', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ landlord: req.user.id });
    
    if (!subscription || subscription.plan === 'free') {
      return res.status(400).json({ 
        success: false,
        message: 'No active premium subscription to cancel' 
      });
    }
    
    // Disable auto-renewal
    subscription.autoRenew = false;
    await subscription.save();
    
    console.log('❌ Cancelled auto-renewal for:', req.user.email);
    
    res.json({
      success: true,
      message: 'Subscription will not auto-renew. You can continue using Premium until ' + 
               new Date(subscription.endDate).toLocaleDateString(),
      subscription: {
        plan: subscription.plan,
        endDate: subscription.endDate,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ==========================================
// REACTIVATE AUTO-RENEWAL
// ==========================================
router.post('/reactivate', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ landlord: req.user.id });
    
    if (!subscription || subscription.plan === 'free') {
      return res.status(400).json({ 
        success: false,
        message: 'No premium subscription found' 
      });
    }
    
    subscription.autoRenew = true;
    await subscription.save();
    
    console.log('✅ Reactivated auto-renewal for:', req.user.email);
    
    res.json({
      success: true,
      message: 'Auto-renewal reactivated',
      subscription: {
        plan: subscription.plan,
        autoRenew: subscription.autoRenew,
        nextPaymentDate: subscription.nextPaymentDate
      }
    });
  } catch (error) {
    console.error('Reactivate error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// ==========================================
// GET SUBSCRIPTION HISTORY
// ==========================================
router.get('/history', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ landlord: req.user.id });
    
    if (!subscription) {
      return res.json({
        success: true,
        history: []
      });
    }
    
    // In a real app, you'd have a separate PaymentHistory model
    // For now, return basic subscription info
    res.json({
      success: true,
      history: [{
        plan: subscription.plan,
        amount: subscription.amount,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status
      }]
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;