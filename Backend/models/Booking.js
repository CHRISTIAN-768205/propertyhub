const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Property reference
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property ID is required']
  },
  
  // Landlord reference (so we can query bookings by landlord)
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Landlord ID is required']
  },
  
  // Tenant/User information (not authenticated, so we store directly)
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Dates
  moveInDate: {
    type: Date,
    required: [true, 'Move-in date is required']
  },
  inquiryDate: {
    type: Date,
    default: Date.now
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  
  // Optional message from tenant
  message: {
    type: String,
    trim: true,
    default: ''
  },

  // ==========================================
  // COMMISSION & PAYMENT FIELDS (NEW)
  // ==========================================
  
  // Rental Details
  monthlyRent: {
    type: Number,
    default: 0
  },
  leaseDuration: {
    type: Number, // in months
    default: 12
  },
  
  // Commission Details
  commissionRate: {
    type: Number, // 5 or 15
    default: 15 // Default to FREE plan rate
  },
  commissionAmount: {
    type: Number, // Calculated commission
    default: 0
  },
  landlordPayout: {
    type: Number, // monthlyRent - commissionAmount
    default: 0
  },
  
  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank', 'cash', 'none'],
    default: 'none'
  },
  transactionId: {
    type: String,
    trim: true
  },
  
  // Additional Payment Details
  securityDeposit: {
    type: Number,
    default: 0
  },
  
  // Payment Timestamps
  paidAt: Date,
  confirmedAt: Date,
  cancelledAt: Date,
  rejectedAt: Date

}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ landlordId: 1, status: 1 });
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Calculate commission before saving
bookingSchema.pre('save', function(next) {
  if (this.monthlyRent && this.commissionRate) {
    this.commissionAmount = (this.monthlyRent * this.commissionRate) / 100;
    this.landlordPayout = this.monthlyRent - this.commissionAmount;
  }
  next();
});

// Populate property details when querying
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'propertyId',
    select: 'title address price images'
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);