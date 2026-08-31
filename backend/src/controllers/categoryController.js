import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all categories with search, status filtering, and count metadata
 * @route   GET /api/categories
 * @access  Public (Default returns active categories; Admin query options supported)
 */
export const getCategories = asyncHandler(async (req, res) => {
  const { all, isActive, search } = req.query;

  // Base Query Filter
  const filter = {};

  // Public default returns active categories unless 'all' or explicit 'isActive' parameter is supplied
  if (all === 'true') {
    // Return all categories (active & inactive)
  } else if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  } else {
    filter.isActive = true; // Default public filter
  }

  // Search by Category Name or Slug
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { slug: searchRegex }];
  }

  // Calculate metadata counts across full dataset
  const [total, activeCount, inactiveCount] = await Promise.all([
    Category.countDocuments({}),
    Category.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: false }),
  ]);

  // Fetch matching categories sorted alphabetically by name
  const categories = await Category.find(filter).sort({ name: 1 });

  // Attach real published collection counts
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const collectionCount = await Collection.countDocuments({
        category: cat._id,
        isPublished: true,
      });
      return {
        ...cat.toObject(),
        collectionCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: categoriesWithCounts.length,
    total,
    activeCount,
    inactiveCount,
    data: categoriesWithCounts,
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
 * @access  Private (Admin)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, icon, description, isActive } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Category name is required');
  }

  if (!slug || !slug.trim()) {
    res.status(400);
    throw new Error('Category slug is required');
  }

  const cleanName = name.trim();
  const cleanSlug = slug.toLowerCase().trim();

  // Prevent duplicate category name or slug
  const existingCategory = await Category.findOne({
    $or: [
      { name: { $regex: new RegExp(`^${cleanName}$`, 'i') } },
      { slug: cleanSlug },
    ],
  });

  if (existingCategory) {
    res.status(400);
    throw new Error(`Category with name '${cleanName}' or slug '${cleanSlug}' already exists`);
  }

  const category = await Category.create({
    name: cleanName,
    slug: cleanSlug,
    icon: icon ? icon.trim() : 'Tag',
    description: description ? description.trim() : '',
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Update category fields
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
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

  // Prevent modifying _id
  if (req.body._id && req.body._id.toString() !== category._id.toString()) {
    res.status(400);
    throw new Error('Cannot modify category ID');
  }

  // Check duplicate slug if slug is changed
  if (slug && slug.toLowerCase().trim() !== category.slug) {
    const cleanSlug = slug.toLowerCase().trim();
    const slugExists = await Category.findOne({ slug: cleanSlug });
    if (slugExists) {
      res.status(400);
      throw new Error(`Category slug '${cleanSlug}' is already in use`);
    }
    category.slug = cleanSlug;
  }

  // Check duplicate name if name is changed
  if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
    const cleanName = name.trim();
    const nameExists = await Category.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, 'i') },
    });
    if (nameExists) {
      res.status(400);
      throw new Error(`Category name '${cleanName}' is already in use`);
    }
    category.name = cleanName;
  }

  if (icon !== undefined) category.icon = icon.trim();
  if (description !== undefined) category.description = description.trim();
  if (isActive !== undefined) category.isActive = isActive;

  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    data: updatedCategory,
  });
});

/**
 * @desc    Toggle category active/inactive status
 * @route   PATCH /api/categories/:id/status
 * @access  Private (Admin)
 */
export const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (isActive === undefined) {
    res.status(400);
    throw new Error('Please provide isActive status boolean');
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(id);
  const category = isObjectId
    ? await Category.findById(id)
    : await Category.findOne({ slug: id.toLowerCase() });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.isActive = Boolean(isActive);
  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    data: updatedCategory,
  });
});

/**
 * @desc    Delete category (Data integrity check against referenced products)
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
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

  // Data Integrity Check: Verify if any Product references this category
  const productCount = await Product.countDocuments({ category: category._id });

  if (productCount > 0) {
    res.status(409); // HTTP 409 Conflict
    throw new Error('Cannot delete this category because products are using it. Deactivate the category instead.');
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
