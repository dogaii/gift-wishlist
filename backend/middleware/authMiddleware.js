const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the token is provided in the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('[Auth Middleware] Token received:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[Auth Middleware] Decoded token:', decoded);

      // Attach user to request (decoded token should have an id)
      req.user = decoded;
      next();
    } catch (error) {
      console.error('[Auth Middleware] Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('[Auth Middleware] No token provided in headers');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = protect;
