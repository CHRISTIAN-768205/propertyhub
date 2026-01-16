const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  rate: {
    type: Number, // 5 or 15
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'collected', 'refunded'],
    default: 'pending'
  },
  collectedAt: Date,
  month: Number, // for reporting
  year: Number
}, {
  timestamps: true
});

// Index for faster queries
commissionSchema.index({ landlord: 1, year: 1, month: 1 });
commissionSchema.index({ status: 1 });

module.exports = mongoose.model('Commission', commissionSchema);