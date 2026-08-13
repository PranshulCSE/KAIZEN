const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Protect route
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};


// Rate limit for sensitive routes
const rateLimit = (maxRequests, windowMinutes) => {
    const requests = {};

    return (req, res, next) => {
        const key = req.user ? req.user.id : req.ip;
        const now = Date.now();
        const windowStart = now - (windowMinutes * 60 * 1000);

        if (!requests[key]) {
            requests[key] = [];
        }

        requests[key] = requests[key].filter(timestamp => timestamp > windowStart);

        if (requests[key].length >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: `Too many requests. Please try again later.`
            });
        }

        requests[key].push(now);
        next();
    };
};

module.exports = { protect, authorize, rateLimit };