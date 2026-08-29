import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  getCategoryProducts
} from '../controllers/categoryController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base Category Endpoints (GET is Public, POST requires Admin)
router.route('/')
  .get(getCategories)
  .post(protect, requireAdmin, createCategory);

// Status Toggle Endpoint (PATCH requires Admin)
router.route('/:id/status')
  .patch(protect, requireAdmin, toggleCategoryStatus);

// Single Category Endpoints (GET is Public, PUT/DELETE require Admin)
router.route('/:id')
  .get(getCategoryById)
  .put(protect, requireAdmin, updateCategory)
  .delete(protect, requireAdmin, deleteCategory);

// Category Products Catalogue Endpoint (Public)
router.route('/:slug/products')
  .get(getCategoryProducts);

export default router;
