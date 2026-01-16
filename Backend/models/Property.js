const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // BASIC PROPERTY INFO
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Property description is required']
  },
  address: {
    type: String,
    required: [true, 'Property address is required']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required']
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio', 'other'],
    default: 'apartment'
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  
  // LOCATION DATA - GeoJSON format for MongoDB geospatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      default: []
    }
  },
  
  // LANDLORD REFERENCE
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Landlord ID is required']
  },
  
  // VISIBILITY - FIXED: was "IsVisible" (capital I), now "isVisible"
  isVisible: {
    type: Boolean,
    default: true
  },
  
  // RATINGS
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // ANALYTICS & TRACKING
  analytics: {
    // View tracking
    views: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      thisWeek: { type: Number, default: 0 },
      today: { type: Number, default: 0 },
      history: [{
        date: Date,
        count: Number
      }]
    },
    
    // Click tracking
    clicks: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      phoneClicks: { type: Number, default: 0 },
      emailClicks: { type: Number, default: 0 },
      whatsappClicks: { type: Number, default: 0 }
    },
    
    // Engagement tracking
    inquiries: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      replied: { type: Number, default: 0 }
    },
    
    // Location tracking
    nearMeImpressions: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 }
    },
    
    // Social engagement
    bookmarks: {
      total: { type: Number, default: 0 },
      thisMonth: { type: Number, default: 0 }
    },
    
    shares: {
      total: { type: Number, default: 0 },
      facebook: { type: Number, default: 0 },
      whatsapp: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 }
    },
    
    // Booking performance
    bookings: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      cancelled: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 }
    },
    
    // Conversion rates (calculated)
    conversionRates: {
      viewToClick: { type: Number, default: 0 },
      clickToInquiry: { type: Number, default: 0 },
      inquiryToBooking: { type: Number, default: 0 },
      overall: { type: Number, default: 0 }
    },
    
    // Last updated timestamps
    lastViewed: Date,
    lastClicked: Date,
    lastInquiry: Date,
    lastBooking: Date
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// INDEXES
propertySchema.index({ location: '2dsphere' });  // For geospatial queries
propertySchema.index({ landlordId: 1 });  // For landlord queries
propertySchema.index({ isVisible: 1 });  // For filtering visible properties
propertySchema.index({ createdAt: -1 });  // For sorting by date

// METHODS

// Track view
propertySchema.methods.trackView = async function() {
  this.analytics.views.total += 1;
  this.analytics.views.thisMonth += 1;
  this.analytics.views.thisWeek += 1;
  this.analytics.views.today += 1;
  this.analytics.lastViewed = new Date();
  
  // Add to history
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = this.analytics.views.history.find(
    h => h.date && h.date.toISOString().split('T')[0] === today
  );
  
  if (todayRecord) {
    todayRecord.count += 1;
  } else {
    this.analytics.views.history.push({ date: new Date(), count: 1 });
  }
  
  // Keep only last 90 days
  if (this.analytics.views.history.length > 90) {
    this.analytics.views.history.shift();
  }
  
  this.updateConversionRates();
  await this.save();
};

// Track click
propertySchema.methods.trackClick = async function(type) {
  this.analytics.clicks.total += 1;
  this.analytics.clicks.thisMonth += 1;
  
  if (type === 'phone') this.analytics.clicks.phoneClicks += 1;
  if (type === 'email') this.analytics.clicks.emailClicks += 1;
  if (type === 'whatsapp') this.analytics.clicks.whatsappClicks += 1;
  
  this.analytics.lastClicked = new Date();
  this.updateConversionRates();
  await this.save();
};

// Track inquiry
propertySchema.methods.trackInquiry = async function() {
  this.analytics.inquiries.total += 1;
  this.analytics.inquiries.thisMonth += 1;
  this.analytics.inquiries.pending += 1;
  this.analytics.lastInquiry = new Date();
  this.updateConversionRates();
  await this.save();
};

// Track Near Me impression
propertySchema.methods.trackNearMeView = async function() {
  this.analytics.nearMeImpressions.total += 1;
  this.analytics.nearMeImpressions.thisMonth += 1;
  await this.save();
};

// Track bookmark
propertySchema.methods.trackBookmark = async function() {
  this.analytics.bookmarks.total += 1;
  this.analytics.bookmarks.thisMonth += 1;
  await this.save();
};

// Track share
propertySchema.methods.trackShare = async function(platform) {
  this.analytics.shares.total += 1;
  if (platform === 'facebook') this.analytics.shares.facebook += 1;
  if (platform === 'whatsapp') this.analytics.shares.whatsapp += 1;
  if (platform === 'twitter') this.analytics.shares.twitter += 1;
  await this.save();
};

// Track booking
propertySchema.methods.trackBooking = async function(amount, status = 'completed') {
  this.analytics.bookings.total += 1;
  if (status === 'completed') {
    this.analytics.bookings.completed += 1;
    this.analytics.bookings.revenue += amount;
  }
  if (status === 'cancelled') this.analytics.bookings.cancelled += 1;
  
  this.analytics.lastBooking = new Date();
  this.updateConversionRates();
  await this.save();
};

// Update conversion rates
propertySchema.methods.updateConversionRates = function() {
  const views = this.analytics.views.total;
  const clicks = this.analytics.clicks.total;
  const inquiries = this.analytics.inquiries.total;
  const bookings = this.analytics.bookings.total;
  
  this.analytics.conversionRates.viewToClick = views > 0 
    ? parseFloat(((clicks / views) * 100).toFixed(2))
    : 0;
    
  this.analytics.conversionRates.clickToInquiry = clicks > 0 
    ? parseFloat(((inquiries / clicks) * 100).toFixed(2))
    : 0;
    
  this.analytics.conversionRates.inquiryToBooking = inquiries > 0 
    ? parseFloat(((bookings / inquiries) * 100).toFixed(2))
    : 0;
    
  this.analytics.conversionRates.overall = views > 0 
    ? parseFloat(((bookings / views) * 100).toFixed(2))
    : 0;
};

// VIRTUAL FIELDS

// Get latitude from location coordinates
propertySchema.virtual('latitude').get(function() {
  return this.location && this.location.coordinates && this.location.coordinates.length > 1 
    ? this.location.coordinates[1] 
    : null;
});

// Get longitude from location coordinates
propertySchema.virtual('longitude').get(function() {
  return this.location && this.location.coordinates && this.location.coordinates.length > 0
    ? this.location.coordinates[0] 
    : null;
});

// PRE-SAVE HOOKS

// Update timestamp before save
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// POST-SAVE HOOKS

// Log property creation
propertySchema.post('save', function(doc, next) {
  if (this.isNew) {
    console.log(`✅ New property created: ${doc.title} (${doc._id})`);
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);