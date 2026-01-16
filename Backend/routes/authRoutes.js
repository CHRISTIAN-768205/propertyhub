const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail, sendWelcomeEmail, sendTenantWelcomeEmail, sendLandlordWelcomeEmail } = require('../utils/emailService');
 
// Register new user with Super Admin support
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, role, adminSecretCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Determine role
    let userRole = role || 'landlord';
    
    // 🔐 SUPER ADMIN SECRET CODE CHECK (ONLY IF CODE IS PROVIDED)
    if (adminSecretCode && adminSecretCode.trim() !== '') {
      const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET || 'PropertyHub@SuperAdmin2024!';
      
      if (adminSecretCode === SUPER_ADMIN_SECRET) {
        // Check if super admin already exists
        const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
        
        if (existingSuperAdmin) {
          return res.status(400).json({ 
            message: '⚠️ Super Admin already exists. Only one super admin is allowed in the system.' 
          });
        }
        
        userRole = 'superadmin';
        console.log('🛡️ Creating Super Admin account for:', email);
      } else {
        // ✅ FIXED: Don't block registration, just show error about wrong code
        return res.status(400).json({ 
          message: '❌ Invalid admin secret code. If you\'re not registering as admin, leave this field empty.' 
        });
      }
    }
    
    // Create new user
    const user = new User({
      fullName,
      email,
      password, // Will be hashed by pre-save hook
      phone,
      role: userRole
    });
    
    await user.save();
    
    // Send appropriate welcome email
    if (userRole === 'superadmin') {
      console.log('✅ Super Admin account created successfully:', email);
      sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));
    } else if (userRole === 'tenant') {
      sendTenantWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));
    } else if (userRole === 'landlord') {
      sendLandlordWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));
    } else {
      sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      message: userRole === 'superadmin' 
        ? '🎉 Super Admin account created successfully!' 
        : 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      role: user.role
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify reset token
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Password reset token is invalid or has expired. Please request a new one.' 
      });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({ 
      message: 'Password reset successful! You can now login with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt for:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('👤 User found - Role:', user.role);
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: '30d' }
    );
    
    console.log('✅ Login successful for:', email, '| Role:', user.role);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      role: user.role
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot password - Send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('🔐 Forgot password request for:', email);
    
    const user = await User.findOne({ email });
    
    // Always return success message for security (don't reveal if email exists)
    if (!user) {
      return res.json({ 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      });
    }
    
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken);
      
      console.log('✅ Password reset email sent to:', email);
      
      res.json({ 
        message: 'Password reset email sent successfully! Please check your inbox.' 
      });
    } catch (emailError) {
      // If email fails, remove reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error('❌ Email send failed:', emailError);
      return res.status(500).json({ 
        message: 'Error sending email. Please try again later or contact support.' 
      });
    }
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;