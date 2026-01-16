const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Property = require('../models/Property');

// Create a new review
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating review for property:', req.body.propertyId);
    console.log('Review data:', req.body);
    
    const { propertyId, rating, review, reviewerName, userName, userEmail } = req.body;
    
    // Validate required fields
    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (!userName || !userName.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    if (!userEmail || !userEmail.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      console.log('❌ Property not found:', propertyId);
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check if user already reviewed this property
    const existingReview = await Review.findOne({ 
      property: propertyId, 
      userEmail: userEmail.toLowerCase().trim() 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this property. Each user can only submit one review per property.' 
      });
    }
    
    // Create review
    const newReview = new Review({
      property: propertyId,
      propertyId: propertyId,
      rating: parseInt(rating),
      review: review || '',
      userName: userName.trim(),
      userEmail: userEmail.toLowerCase().trim(),
      reviewerName: reviewerName || userName.trim()
    });
    
    await newReview.save();
    console.log('✅ Review created successfully:', newReview._id);
    
    // Update property rating
    await updatePropertyRating(propertyId);
    
    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('❌ Error creating review:', error);
    
    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already reviewed this property' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error creating review', 
      error: error.message 
    });
  }
});

// Get reviews for a property
router.get('/property/:propertyId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      $or: [
        { property: req.params.propertyId },
        { propertyId: req.params.propertyId }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({ 
      message: 'Error fetching reviews', 
      error: error.message 
    });
  }
});

// Get all reviews (admin)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('property propertyId', 'title address')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({ 
      message: 'Error fetching reviews', 
      error: error.message 
    });
  }
});

// Helper function to update property rating
async function updatePropertyRating(propertyId) {
  try {
    const reviews = await Review.find({ 
      $or: [
        { property: propertyId },
        { propertyId: propertyId }
      ]
    });
    
    if (reviews.length === 0) {
      await Property.findByIdAndUpdate(propertyId, {
        rating: 0,
        reviewCount: 0
      });
      return;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Property.findByIdAndUpdate(propertyId, {
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
    
    console.log(`✅ Updated property ${propertyId} rating to ${averageRating.toFixed(1)} (${reviews.length} reviews)`);
  } catch (error) {
    console.error('❌ Error updating property rating:', error);
  }
}

// Delete review (optional - for admin)
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const propertyId = review.property || review.propertyId;
    
    await review.deleteOne();
    
    // Update property rating after deletion
    await updatePropertyRating(propertyId);
    
    console.log('✅ Review deleted');
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    res.status(500).json({ 
      message: 'Error deleting review', 
      error: error.message 
    });
  }
});

module.exports = router;