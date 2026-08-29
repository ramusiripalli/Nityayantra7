import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} from '../controllers/categoryController.js';

const router = express.Router();

// Base Category Endpoints
router.route('/')
  .get(getCategories)
  .post(createCategory);

// Single Category Endpoints
router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

// Category Products Catalogue Endpoint
router.route('/:slug/products')
  .get(getCategoryProducts);

export default router;
