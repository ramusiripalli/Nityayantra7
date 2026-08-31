import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check reporting backend operational status and MongoDB connection state
 *          Never exposes raw connection strings, credentials, or sensitive cluster info.
 * @access  Public
 */
router.get('/', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isDbConnected = readyState === 1;

  res.status(isDbConnected ? 200 : 503).json({
    success: true,
    backend: 'running',
    status: isDbConnected ? 'healthy' : 'degraded',
    message: isDbConnected
      ? 'Backend is running and MongoDB is connected'
      : 'Backend is running but MongoDB connection is not established',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: stateMap[readyState] || 'unknown',
      connected: isDbConnected,
      readyState,
    },
  });
});

export default router;
