const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  uniqueViewers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ipAddress: String,
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dailyViews: [{
    date: {
      type: Date,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);