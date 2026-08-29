import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Backend service health check
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nitya Yantra API is running'
  });
});

export default router;
