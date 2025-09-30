const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to protect routes by verifying JWT.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Log token for debugging (remove in production)
      console.log('Token received:', token);
      console.log('JWT_SECRET exists:', !!JWT_SECRET);

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to the request
      req.user = decoded;
      return next(); // Add return here
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' }); // Add return here
    }
  }

  // This only runs if no Authorization header was found
  return res.status(401).json({ message: 'Not authorized, no token' }); // Add return here
};

/**
 * Middleware to check for specific roles.
 * @param {...string} roles - The roles allowed to access the route.
 * @returns {function} Express middleware function.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user?.role || 'undefined'} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };