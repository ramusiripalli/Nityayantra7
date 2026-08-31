import express from 'express';
import { getMarketplaces } from '../controllers/marketplaceController.js';

const router = express.Router();

// GET /api/marketplaces (Public)
router.get('/', getMarketplaces);

export default router;
