import express from 'express';
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  getPublicCollections,
  getPublicCollectionBySlug,
} from '../controllers/collectionController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicCollections);
router.get('/public/:slug', getPublicCollectionBySlug);

// Admin collection routes
router
  .route('/')
  .get(protect, requireAdmin, getCollections)
  .post(protect, requireAdmin, createCollection);

router
  .route('/:id')
  .get(protect, requireAdmin, getCollectionById)
  .put(protect, requireAdmin, updateCollection)
  .delete(protect, requireAdmin, deleteCollection);

export default router;
