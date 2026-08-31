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

// Backward-compatible explicit public routes
router.get('/public', getPublicCollections);
router.get('/public/:slug', getPublicCollectionBySlug);

// GET /api/collections: Public by default (returns published collections); Admin if Bearer token present
router
  .route('/')
  .get((req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      return protect(req, res, () => requireAdmin(req, res, () => getCollections(req, res, next)));
    }
    return getPublicCollections(req, res, next);
  })
  .post(protect, requireAdmin, createCollection);

// Single Collection Endpoints (GET is Public by slug or ID; PUT/DELETE require Admin)
router
  .route('/:slug')
  .get((req, res, next) => {
    // If request contains admin token and queries admin endpoints, allow admin getCollectionById
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') && req.query.admin === 'true') {
      return protect(req, res, () => requireAdmin(req, res, () => getCollectionById(req, res, next)));
    }
    return getPublicCollectionBySlug(req, res, next);
  })
  .put(protect, requireAdmin, updateCollection)
  .delete(protect, requireAdmin, deleteCollection);

export default router;
