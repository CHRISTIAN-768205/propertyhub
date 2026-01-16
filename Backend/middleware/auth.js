const jwt = require('jsonwebtoken');

// Authentication middleware
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header, access denied' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    
    console.log('🔐 Decoded token:', decoded);
    
    // Add user info to request - handle both 'userId' and 'id' from token
    req.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      id: decoded.userId || decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role
    };
    
    console.log('👤 User from token:', req.user);
    
    if (!req.user.userId) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    // More specific error messages
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired', error: error.message });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
    
    res.status(401).json({ message: 'Token authentication failed', error: error.message });
  }
};

// Optional: Middleware to check specific roles
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access forbidden. Insufficient permissions.',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Optional: Middleware for routes that work with or without authentication
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      req.user = null;
      return next();
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    
    req.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      id: decoded.userId || decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

module.exports = { auth, checkRole, optionalAuth };