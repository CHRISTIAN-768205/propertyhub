const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // Property alert preferences
  alertsEnabled: {
    type: Boolean,
    default: true
  },
  priceRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 200000
    }
  },
  preferredLocations: [{
    type: String,
    trim: true
  }],
  requiredAmenities: [{
    type: String,
    enum: [
      'WiFi',
      'Parking',
      'AC',
      'Security',
      'Gym',
      'Pool',
      'Pet-friendly',
      'Furnished',
      'Balcony',
      'Garden',
      'Elevator',
      'Laundry',
      'Kitchen',
      'Generator'
    ]
  }],
  minBedrooms: {
    type: Number,
    default: 0
  },
  minBathrooms: {
    type: Number,
    default: 0
  },
  emailFrequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'instant'
  },
  lastNotified: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);