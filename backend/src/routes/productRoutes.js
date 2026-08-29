import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Base Product Endpoints (List & Create)
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Single Product Endpoints (Get, Update & Delete)
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
