import express from 'express';
import {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dedicated Search Endpoint: GET /api/products/search?q=...
router.get('/search', searchProducts);

// Base Product Endpoints (GET is Public, POST requires Admin)
router.route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

// Single Product Endpoints: GET /api/products/:id (by numeric productId, slug, or _id)
router.route('/:id')
  .get(getProductById)
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

export default router;
