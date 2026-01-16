const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'website_footer',
    enum: ['website_footer', 'landing_page', 'popup', 'checkout', 'admin']
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Index for faster queries
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;