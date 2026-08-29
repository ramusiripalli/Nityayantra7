import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Middleware: Verify Authentication Token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401);
        throw new Error('Authentication required');
      }

      // Verify Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'nityayantra_fallback_secret'
      );

      // Fetch User (Excluding Password)
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        res.status(401);
        throw new Error('Authentication required');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Authentication required');
    }
  } else {
    res.status(401);
    throw new Error('Authentication required');
  }
});

/**
 * Middleware: Require Admin Role Authorization
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    res.json({
      success: false,
      message: 'Admin access required',
    });
  }
};
