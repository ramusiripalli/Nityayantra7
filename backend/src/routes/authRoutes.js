import express from 'express';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// Admin Login Endpoint
router.post('/login', loginUser);

export default router;
