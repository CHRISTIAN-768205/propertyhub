const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { sendNewsletterWelcomeEmail } = require('../utils/emailService');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid email address' 
      });
    }
    
    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ 
          success: false,
          message: '📧 You are already subscribed to our newsletter!' 
        });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        existing.subscribedAt = new Date();
        await existing.save();
        
        console.log('✅ Reactivated newsletter subscription:', email);
        
        return res.json({ 
          success: true,
          message: '🎉 Welcome back! Your subscription has been reactivated.' 
        });
      }
    }
    
    // Create new subscription
    const subscription = new Newsletter({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      isActive: true
    });
    
    await subscription.save();
    
    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email);
      console.log('✅ Newsletter welcome email sent to:', email);
    } catch (emailError) {
      console.error('⚠️ Welcome email failed (subscription still saved):', emailError);
    }
    
    console.log('✅ New newsletter subscription:', email);
    
    res.json({ 
      success: true,
      message: '🎉 Success! Check your email to confirm your subscription.' 
    });
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscription = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false,
        message: 'Email not found in our subscription list' 
      });
    }
    
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();
    
    console.log('✅ Newsletter unsubscribed:', email);
    
    res.json({ 
      success: true,
      message: 'You have been unsubscribed from our newsletter' 
    });
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong. Please try again.' 
    });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 });
    
    res.json({ 
      success: true,
      count: subscribers.length,
      subscribers 
    });
  } catch (error) {
    console.error('❌ Get subscribers error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch subscribers' 
    });
  }
});

module.exports = router;