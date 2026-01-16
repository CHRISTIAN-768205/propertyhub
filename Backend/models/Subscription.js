const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  amount: {
    type: Number,
    default: 0 // 0 for free, 1000 for premium
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank'],
    default: 'mpesa'
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  lastPaymentDate: Date,
  nextPaymentDate: Date
}, {
  timestamps: true
});

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  if (this.plan === 'free') return true;
  if (this.status !== 'active') return false;
  if (this.endDate && this.endDate < Date.now()) return false;
  return true;
};

// Method to get commission rate
subscriptionSchema.methods.getCommissionRate = function() {
  return this.plan === 'premium' ? 5 : 15; // 5% or 15%
};

module.exports = mongoose.model('Subscription', subscriptionSchema);