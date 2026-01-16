const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

  subscription: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Subscription'
},
totalCommissionPaid: {
  type: Number,
  default: 0
},
totalBookings: {
  type: Number,
  default: 0
},
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['landlord', 'tenant', 'admin', 'superadmin'], // ← ADDED 'superadmin'
    default: 'landlord'
  },
  suspended: {
    type: Boolean,
    default: false
  },
  suspendedAt: Date,
  suspendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  suspensionReason: String,
  flagged: {
    type: Boolean,
    default: false
  },
  flaggedReason: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Password reset fields
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and save to database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expiration to 1 hour from now
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  // Return unhashed token (this is what we send in email)
  return resetToken;
};


module.exports = mongoose.model('User', userSchema);