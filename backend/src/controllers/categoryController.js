import Category from '../models/Category.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const { all } = req.query;
  const filter = all === 'true' ? {} : { isActive: true };

  // Sort alphabetically by name
  const categories = await Category.find(filter).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const category = isObjectId
    ? await Category.findById(id)
    : await Category.findOne({ slug: id.toLowerCase() });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Public (Admin)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, icon, description, isActive } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error('Category name and slug are required');
  }

  const cleanSlug = slug.toLowerCase().trim();

  // Prevent duplicate category name or slug
  const existingCategory = await Category.findOne({
    $or: [{ name: name.trim() }, { slug: cleanSlug }],
  });

  if (existingCategory) {
    res.status(400);
    throw new Error(`Category with name '${name}' or slug '${slug}' already exists`);
  }

  const category = await Category.create({
    name: name.trim(),
    slug: cleanSlug,
    icon: icon || 'Tag',
    description: description || '',
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Public (Admin)
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, icon, description, isActive } = req.body;

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const category = isObjectId
    ? await Category.findById(id)
    : await Category.findOne({ slug: id.toLowerCase() });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check duplicate slug if slug is changed
  if (slug && slug.toLowerCase() !== category.slug) {
    const slugExists = await Category.findOne({ slug: slug.toLowerCase() });
    if (slugExists) {
      res.status(400);
      throw new Error(`Category slug '${slug}' is already in use`);
    }
    category.slug = slug.toLowerCase();
  }

  if (name) category.name = name.trim();
  if (icon !== undefined) category.icon = icon;
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;

  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    data: updatedCategory,
  });
});

/**
 * @desc    Delete category (Protected against products assigned)
 * @route   DELETE /api/categories/:id
 * @access  Public (Admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const category = isObjectId
    ? await Category.findById(id)
    : await Category.findOne({ slug: id.toLowerCase() });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check whether any Product references this category
  const productCount = await Product.countDocuments({ category: category._id });

  if (productCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category: ${productCount} products are assigned to it`);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

/**
 * @desc    Get paginated products by category slug
 * @route   GET /api/categories/:slug/products
 * @access  Public
 */
export const getCategoryProducts = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const category = await Category.findOne({ slug: slug.toLowerCase() });

  if (!category) {
    res.status(404);
    throw new Error(`Category '${slug}' not found`);
  }

  const filter = { category: category._id, isPublished: true, isActive: true };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', '_id name slug icon')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
      },
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});
