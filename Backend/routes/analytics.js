const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Property = require('../models/Property');
const { auth, optionalAuth } = require('../middleware/auth');

// Middleware to track property view - NO AUTH REQUIRED (public can view)
router.post('/track-view/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user?.id; // If user is logged in
    const ipAddress = req.ip || req.connection.remoteAddress;

    console.log(`📊 Tracking view for property: ${propertyId}`);

    // Also update the property's analytics.views
    const property = await Property.findById(propertyId);
    if (property) {
      await property.trackView();
      console.log(`✅ Property view tracked: ${property.title}`);
    }

    let analytics = await Analytics.findOne({ propertyId });

    if (!analytics) {
      analytics = new Analytics({
        propertyId,
        viewCount: 0,
        uniqueViewers: [],
        dailyViews: []
      });
    }

    // Increment view count
    analytics.viewCount += 1;

    // Track unique viewer
    const existingViewer = analytics.uniqueViewers.find(
      viewer => 
        (userId && viewer.userId?.toString() === userId) ||
        (!userId && viewer.ipAddress === ipAddress)
    );

    if (!existingViewer) {
      analytics.uniqueViewers.push({
        userId: userId || null,
        ipAddress,
        viewedAt: new Date()
      });
    }

    // Track daily views
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyView = analytics.dailyViews.find(
      dv => dv.date.getTime() === today.getTime()
    );

    if (dailyView) {
      dailyView.count += 1;
    } else {
      analytics.dailyViews.push({
        date: today,
        count: 1
      });
    }

    analytics.updatedAt = new Date();
    await analytics.save();

    res.json({ success: true, viewCount: analytics.viewCount });
  } catch (error) {
    console.error('❌ Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Get analytics for a specific property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Get from Property model (more comprehensive)
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Also get Analytics model data if exists
    const analytics = await Analytics.findOne({ propertyId });

    res.json({
      // From Property model
      views: property.analytics?.views?.total || 0,
      viewsThisMonth: property.analytics?.views?.thisMonth || 0,
      clicks: property.analytics?.clicks?.total || 0,
      inquiries: property.analytics?.inquiries?.total || 0,
      bookings: property.analytics?.bookings?.total || 0,
      bookmarks: property.analytics?.bookmarks?.total || 0,
      shares: property.analytics?.shares?.total || 0,
      conversionRates: property.analytics?.conversionRates || {},
      
      // From Analytics model (if exists)
      uniqueViewers: analytics?.uniqueViewers?.length || 0,
      dailyViews: analytics?.dailyViews?.slice(-30) || [], // Last 30 days
      
      updatedAt: property.updatedAt
    });
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get analytics for landlord's properties - FIXED WITH AUTH
router.get('/landlord/properties', auth, async (req, res) => {
  try {
    const landlordId = req.user.id; // Now req.user exists!

    console.log(`📊 Fetching analytics for landlord: ${landlordId}`);

    // Get all properties owned by landlord
    const properties = await Property.find({ landlordId });
    
    if (properties.length === 0) {
      return res.json([]);
    }

    const propertyIds = properties.map(p => p._id);

    // Get analytics for all properties
    const analytics = await Analytics.find({
      propertyId: { $in: propertyIds }
    });

    // Create a map for quick lookup
    const analyticsMap = {};
    analytics.forEach(a => {
      analyticsMap[a.propertyId.toString()] = a;
    });

    // Combine property data with analytics
    const analyticsData = properties.map(property => {
      const propertyAnalytics = analyticsMap[property._id.toString()];
      
      return {
        propertyId: property._id,
        title: property.title,
        address: property.address,
        images: property.images,
        rating: property.rating || 0,
        reviewCount: property.reviewCount || 0,
        
        // From Property.analytics
        views: property.analytics?.views?.total || 0,
        viewsThisMonth: property.analytics?.views?.thisMonth || 0,
        clicks: property.analytics?.clicks?.total || 0,
        inquiries: property.analytics?.inquiries?.total || 0,
        bookings: property.analytics?.bookings?.total || 0,
        revenue: property.analytics?.bookings?.revenue || 0,
        
        // From Analytics model
        uniqueViewers: propertyAnalytics?.uniqueViewers?.length || 0,
        recentViews: propertyAnalytics?.dailyViews?.slice(-7) || [] // Last 7 days
      };
    });

    console.log(`✅ Found analytics for ${analyticsData.length} properties`);
    res.json(analyticsData);
  } catch (error) {
    console.error('❌ Error fetching landlord analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      message: error.message 
    });
  }
});

// Get summary analytics for landlord dashboard
router.get('/landlord/summary', auth, async (req, res) => {
  try {
    const landlordId = req.user.id;

    const properties = await Property.find({ landlordId });
    
    const summary = {
      totalProperties: properties.length,
      totalViews: 0,
      totalViewsThisMonth: 0,
      totalClicks: 0,
      totalInquiries: 0,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
      conversionRate: 0
    };

    properties.forEach(property => {
      summary.totalViews += property.analytics?.views?.total || 0;
      summary.totalViewsThisMonth += property.analytics?.views?.thisMonth || 0;
      summary.totalClicks += property.analytics?.clicks?.total || 0;
      summary.totalInquiries += property.analytics?.inquiries?.total || 0;
      summary.totalBookings += property.analytics?.bookings?.completed || 0;
      summary.totalRevenue += property.analytics?.bookings?.revenue || 0;
      summary.totalReviews += property.reviewCount || 0;
      
      if (property.rating > 0) {
        summary.averageRating += property.rating;
      }
    });

    // Calculate average rating across all properties
    const propertiesWithRatings = properties.filter(p => p.rating > 0).length;
    if (propertiesWithRatings > 0) {
      summary.averageRating = parseFloat((summary.averageRating / propertiesWithRatings).toFixed(1));
    }

    // Calculate overall conversion rate
    if (summary.totalViews > 0) {
      summary.conversionRate = parseFloat(((summary.totalBookings / summary.totalViews) * 100).toFixed(2));
    }

    res.json(summary);
  } catch (error) {
    console.error('❌ Error fetching summary:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;