import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base Product Endpoints (GET is Public, POST requires Admin)
router.route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

// Single Product Endpoints (GET is Public, PUT/DELETE require Admin)
router.route('/:id')
  .get(getProductById)
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

export default router;
