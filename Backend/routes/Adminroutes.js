// Backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Middleware to check if user is super admin
const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ 
      verified: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all landlords
router.get('/landlords', auth, isSuperAdmin, async (req, res) => {
  try {
    const landlords = await User.find({ role: 'landlord' })
      .select('-password')
      .sort({ createdAt: -1 });

    const landlordsWithCounts = await Promise.all(
      landlords.map(async (landlord) => {
        const propertyCount = await Property.countDocuments({ landlord: landlord._id });
        return {
          ...landlord.toObject(),
          propertyCount
        };
      })
    );

    res.json(landlordsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats
router.get('/stats', auth, isSuperAdmin, async (req, res) => {
  try {
    const totalLandlords = await User.countDocuments({ role: 'landlord' });
    const totalProperties = await Property.countDocuments();
    const activeListings = await Property.countDocuments({ available: true });
    const suspendedAccounts = await User.countDocuments({ role: 'landlord', suspended: true });

    res.json({
      totalLandlords,
      totalProperties,
      activeListings,
      suspendedAccounts,
      reportsThisMonth: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Suspend landlord
router.put('/landlords/:id/suspend', auth, isSuperAdmin, async (req, res) => {
  try {
    const landlord = await User.findById(req.params.id);
    if (!landlord) return res.status(404).json({ message: 'Not found' });

    landlord.suspended = true;
    await landlord.save();

    await Property.updateMany({ landlord: landlord._id }, { suspended: true });

    res.json({ message: 'Landlord suspended' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsuspend landlord
router.put('/landlords/:id/unsuspend', auth, isSuperAdmin, async (req, res) => {
  try {
    const landlord = await User.findById(req.params.id);
    if (!landlord) return res.status(404).json({ message: 'Not found' });

    landlord.suspended = false;
    await landlord.save();

    await Property.updateMany({ landlord: landlord._id }, { suspended: false });

    res.json({ message: 'Landlord reactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete landlord
router.delete('/landlords/:id', auth, isSuperAdmin, async (req, res) => {
  try {
    await Property.deleteMany({ landlord: req.params.id });
    await Booking.deleteMany({ landlord: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Landlord deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;