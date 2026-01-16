const cron = require('node-cron');
const Property = require('./models/Property');
const Booking = require('./models/Booking');
const UserPreferences = require('./models/UserPreferences');
const {
  sendPropertyMatchAlert,
  sendMoveInReminder
} = require('./utils/emailNotifications');

// Check for new properties matching user preferences (runs every hour)
const checkPropertyMatches = cron.schedule('0 * * * *', async () => {
  try {
    console.log('🔍 Checking for property matches...');
    
    // Get all users with alerts enabled
    const users = await UserPreferences.find({ alertsEnabled: true });
    
    for (const userPref of users) {
      // Skip if user wants daily/weekly updates and was notified recently
      if (userPref.emailFrequency === 'daily' && userPref.lastNotified) {
        const hoursSinceLastNotif = (new Date() - new Date(userPref.lastNotified)) / (1000 * 60 * 60);
        if (hoursSinceLastNotif < 24) continue;
      }
      
      if (userPref.emailFrequency === 'weekly' && userPref.lastNotified) {
        const daysSinceLastNotif = (new Date() - new Date(userPref.lastNotified)) / (1000 * 60 * 60 * 24);
        if (daysSinceLastNotif < 7) continue;
      }
      
      // Build query based on preferences
      const query = {
        hidden: false,
        rating: { $gte: 0 }
      };
      
      // Price range
      if (userPref.priceRange.min > 0 || userPref.priceRange.max < 200000) {
        query.$expr = {
          $and: [
            { $gte: [{ $toInt: { $replaceAll: { input: '$cost', find: /[^0-9]/g, replacement: '' } } }, userPref.priceRange.min] },
            { $lte: [{ $toInt: { $replaceAll: { input: '$cost', find: /[^0-9]/g, replacement: '' } } }, userPref.priceRange.max] }
          ]
        };
      }
      
      // Locations
      if (userPref.preferredLocations.length > 0) {
        query.location = { $in: userPref.preferredLocations.map(loc => new RegExp(loc, 'i')) };
      }
      
      // Required amenities
      if (userPref.requiredAmenities.length > 0) {
        query.amenities = { $all: userPref.requiredAmenities };
      }
      
      // Bedrooms/Bathrooms
      if (userPref.minBedrooms > 0) {
        query.bedrooms = { $gte: userPref.minBedrooms };
      }
      if (userPref.minBathrooms > 0) {
        query.bathrooms = { $gte: userPref.minBathrooms };
      }
      
      // Only get properties created since last notification (or in last 24 hours)
      const lastCheck = userPref.lastNotified || new Date(Date.now() - 24 * 60 * 60 * 1000);
      query.createdAt = { $gt: lastCheck };
      
      // Find matching properties
      const matchingProperties = await Property.find(query).limit(10);
      
      if (matchingProperties.length > 0) {
        console.log(`📧 Sending ${matchingProperties.length} property matches to ${userPref.email}`);
        await sendPropertyMatchAlert(userPref.email, userPref.name, matchingProperties);
        
        // Update last notified time
        userPref.lastNotified = new Date();
        await userPref.save();
      }
    }
    
    console.log('✅ Property match check complete');
  } catch (error) {
    console.error('❌ Error checking property matches:', error);
  }
});

// Send move-in reminders (runs daily at 9 AM)
const sendMoveInReminders = cron.schedule('0 9 * * *', async () => {
  try {
    console.log('🗓️ Sending move-in reminders...');
    
    // Get confirmed bookings with move-in date in next 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const upcomingBookings = await Booking.find({
      status: 'confirmed',
      moveInDate: {
        $gte: tomorrow,
        $lte: threeDaysFromNow
      }
    }).populate('property');
    
    for (const booking of upcomingBookings) {
      if (booking.property) {
        console.log(`📧 Sending move-in reminder to ${booking.userEmail}`);
        await sendMoveInReminder(booking, booking.property);
      }
    }
    
    console.log(`✅ Sent ${upcomingBookings.length} move-in reminders`);
  } catch (error) {
    console.error('❌ Error sending move-in reminders:', error);
  }
});

module.exports = {
  startScheduledJobs: () => {
    console.log('⏰ Starting scheduled email jobs...');
    checkPropertyMatches.start();
    sendMoveInReminders.start();
    console.log('✅ Scheduled jobs started');
  },
  stopScheduledJobs: () => {
    checkPropertyMatches.stop();
    sendMoveInReminders.stop();
    console.log('🛑 Scheduled jobs stopped');
  }
};