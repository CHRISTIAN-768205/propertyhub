const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    default: ''
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  reviewerName: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per property (prevents duplicates)
reviewSchema.index({ property: 1, userEmail: 1 }, { unique: true });

// Also index by propertyId for faster queries
reviewSchema.index({ propertyId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);