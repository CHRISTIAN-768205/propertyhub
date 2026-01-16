const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { auth, checkRole, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation middleware for property creation
const validateProperty = (req, res, next) => {
  const { title, description, address, price, bedrooms, bathrooms, propertyType } = req.body;
  
  console.log('🔍 Validating property data:', {
    title: title || 'MISSING',
    description: description ? `${description.substring(0, 20)}...` : 'MISSING',
    address: address || 'MISSING',
    price: price || 'MISSING',
    bedrooms: bedrooms || 'MISSING',
    bathrooms: bathrooms || 'MISSING',
    propertyType: propertyType || 'MISSING'
  });
  
  const errors = [];
  
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (!address || address.trim().length < 5) {
    errors.push('Address must be at least 5 characters long');
  }
  
  if (!price || isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  if (bedrooms === undefined || bedrooms === null || isNaN(bedrooms) || bedrooms < 0) {
    errors.push('Bedrooms must be a valid number');
  }
  
  if (bathrooms === undefined || bathrooms === null || isNaN(bathrooms) || bathrooms < 0) {
    errors.push('Bathrooms must be a valid number');
  }
  
  const validPropertyTypes = ['apartment', 'house', 'condo', 'townhouse', 'studio', 'other'];
  if (!propertyType || !validPropertyTypes.includes(propertyType)) {
    errors.push(`Invalid property type. Must be one of: ${validPropertyTypes.join(', ')}`);
  }
  
  if (errors.length > 0) {
    console.log('❌ Validation errors:', errors);
    return res.status(400).json({ errors });
  }
  
  console.log('✅ Validation passed');
  next();
};

// ============================================
// DEBUG ROUTES (Can remove after testing)
// ============================================

// Get ALL properties regardless of visibility
router.get('/debug/all', async (req, res) => {
  try {
    const allProperties = await Property.find({});
    console.log('📋 ALL Properties in database:', allProperties.length);
    
    res.json({
      total: allProperties.length,
      visible: allProperties.filter(p => p.isVisible === true).length,
      hidden: allProperties.filter(p => p.isVisible === false).length,
      undefined: allProperties.filter(p => p.isVisible === undefined).length,
      properties: allProperties.map(p => ({
        id: p._id,
        title: p.title,
        isVisible: p.isVisible,
        address: p.address,
        price: p.price,
        images: p.images?.length || 0
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Make ALL properties visible
router.get('/debug/make-all-visible', async (req, res) => {
  try {
    const result = await Property.updateMany(
      {},
      { $set: { isVisible: true } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} properties to visible`);
    
    const properties = await Property.find({});
    
    res.json({
      message: `Updated ${result.modifiedCount} properties to visible`,
      total: properties.length,
      properties: properties.map(p => ({
        id: p._id,
        title: p.title,
        isVisible: p.isVisible
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all visible properties (public)
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching all visible properties...');
    const properties = await Property.find({ isVisible: true })
      .populate('landlordId', 'name email phone')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${properties.length} visible properties`);
    res.json(properties);
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get landlord's properties (protected)
router.get('/my-properties', auth, async (req, res) => {
  try {
    const landlordId = req.user.id;
    console.log(`📋 Fetching properties for landlord: ${landlordId}`);
    
    const properties = await Property.find({ landlordId })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${properties.length} properties for landlord`);
    res.json(properties);
  } catch (error) {
    console.error('❌ Error fetching landlord properties:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single property by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId', 'name email phone');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('❌ Error fetching property:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROTECTED ROUTES
// ============================================

// Create property
router.post('/', 
  auth, 
  checkRole('landlord'),
  (req, res, next) => {
    console.log('📤 Incoming property creation request...');
    upload.array('images', 5)(req, res, (err) => {
      if (err) {
        console.error('❌ Upload error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large. Maximum size is 10MB per image.' 
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ 
            error: 'Too many files. Maximum is 5 images.' 
          });
        }
        return res.status(400).json({ 
          error: err.message || 'Error uploading images' 
        });
      }
      next();
    });
  },
  (req, res, next) => {
    console.log('📝 Received request body:', req.body);
    console.log('📸 Received files:', req.files?.length || 0);
    next();
  },
  validateProperty,
  async (req, res) => {
    try {
      const { title, description, address, price, bedrooms, bathrooms, propertyType, amenities, latitude, longitude } = req.body;
      
      console.log('🏠 Creating new property...');
      
      const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
      console.log('🖼️ Images:', images.length);

      let parsedAmenities = [];
      if (amenities) {
        try {
          parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        } catch (e) {
          console.log('⚠️ Could not parse amenities');
        }
      }

      const property = new Property({
        title,
        description,
        address,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        propertyType: propertyType || 'apartment',
        images,
        landlordId: req.user.id,
        isVisible: true, // Default to visible
        amenities: parsedAmenities,
        location: {
          type: 'Point',
          coordinates: latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : []
        }
      });

      await property.save();
      console.log('✅ Property created:', property._id, 'isVisible:', property.isVisible);
      
      res.status(201).json(property);
    } catch (error) {
      console.error('❌ Error creating property:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Update property
router.put('/:id', 
  auth, 
  checkRole('landlord'),
  (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
      if (err) {
        console.error('❌ Upload error:', err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      if (property.landlordId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const updates = req.body;
      
      if (updates.price) updates.price = parseFloat(updates.price);
      if (updates.bedrooms !== undefined) updates.bedrooms = parseInt(updates.bedrooms);
      if (updates.bathrooms !== undefined) updates.bathrooms = parseInt(updates.bathrooms);
      
      if (updates.amenities) {
        try {
          updates.amenities = typeof updates.amenities === 'string' ? JSON.parse(updates.amenities) : updates.amenities;
        } catch (e) {}
      }
      
      if (updates.latitude && updates.longitude) {
        updates.location = {
          type: 'Point',
          coordinates: [parseFloat(updates.longitude), parseFloat(updates.latitude)]
        };
      }
      
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/${file.filename}`);
        updates.images = [...(property.images || []), ...newImages];
      }
      
      Object.assign(property, updates);
      await property.save();
      
      console.log('✅ Property updated');
      res.json(property);
    } catch (error) {
      console.error('❌ Error updating property:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Toggle property visibility
router.put('/:id/toggle-visibility', auth, checkRole('landlord'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    if (property.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    property.isVisible = !property.isVisible;
    await property.save();
    
    console.log(`✅ Property ${property._id} visibility: ${property.isVisible}`);
    
    res.json({ 
      success: true, 
      isVisible: property.isVisible,
      message: property.isVisible ? 'Property is now visible to public' : 'Property is now hidden from public'
    });
  } catch (error) {
    console.error('❌ Error toggling visibility:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete property
router.delete('/:id', auth, checkRole('landlord'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (property.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await property.deleteOne();
    
    console.log('✅ Property deleted');
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;