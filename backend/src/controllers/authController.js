import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Generate JWT Token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'nityayantra_fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Admin Login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate Input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const cleanEmail = email.toLowerCase().trim();

  // 2. Find User by Email (Explicitly select password hash)
  const user = await User.findOne({ email: cleanEmail }).select('+password');

  // 3. Generic Error for Invalid Credentials or Inactive User (Prevents Account Enumeration)
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // 4. Compare Password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // 5. Update Last Login Timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // 6. Generate Token & Send Sanitized Response
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
