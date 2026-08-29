import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all products with pagination, search, filters & sorting
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const {
    category,
    search,
    featured,
    trending,
    published,
    sort
  } = req.query;

  // Base Query Filter
  const query = {};

  // 1. Published Status (Default: only published products)
  if (published !== undefined) {
    query.isPublished = published === 'true';
  } else {
    query.isPublished = true;
  }

  query.isActive = true;

  // 2. Featured / Trending Filters
  if (featured !== undefined) {
    query.isFeatured = featured === 'true';
  }
  if (trending !== undefined) {
    query.isTrending = trending === 'true';
  }

  // 3. Category Filter (by slug or ObjectId)
  if (category && category !== 'all') {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      // Find category by slug
      const catObj = await Category.findOne({ slug: category.toLowerCase() });
      if (catObj) {
        query.category = catObj._id;
      } else {
        // If category slug not found, return empty results cleanly
        return res.status(200).json({
          success: true,
          data: {
            products: [],
            pagination: { page, limit, total: 0, totalPages: 0 }
          }
        });
      }
    }
  }

  // 4. Text Search against name, description, keyFeatures
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { keyFeatures: searchRegex },
      { shortDescription: searchRegex }
    ];
  }

  // 5. Sorting Options
  let sortOption = { createdAt: -1 }; // default newest

  switch (sort) {
    case 'featured':
      sortOption = { isFeatured: -1, createdAt: -1 };
      break;
    case 'price_asc':
    case 'price_low':
      sortOption = { 'marketplaceOffers.0.price': 1, createdAt: -1 };
      break;
    case 'price_desc':
    case 'price_high':
      sortOption = { 'marketplaceOffers.0.price': -1, createdAt: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1, reviewCount: -1 };
      break;
    case 'discount':
      sortOption = { discountPercent: -1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  // Execute Query with Pagination
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', '_id name slug icon')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    }
  });
});

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const product = isObjectId
    ? await Product.findById(id).populate('category', '_id name slug icon')
    : await Product.findOne({ slug: id.toLowerCase() }).populate('category', '_id name slug icon');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public (Admin)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    shortDescription,
    category,
    images,
    videos,
    marketplaceOffers,
    rating,
    reviewCount,
    editorialRating,
    discountPercent,
    keyFeatures,
    specs,
    pros,
    cons,
    isPublished,
    isFeatured,
    isTrending,
    isActive
  } = req.body;

  // 1. Required Field Validation
  if (!name || !slug || !description || !category) {
    res.status(400);
    throw new Error('Product name, slug, description, and category are required');
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    res.status(400);
    throw new Error('At least one product image is required');
  }

  if (!marketplaceOffers || !Array.isArray(marketplaceOffers) || marketplaceOffers.length === 0) {
    res.status(400);
    throw new Error('At least one marketplace offer is required');
  }

  // 2. Verify Category Exists & Is Active
  const isCategoryObjectId = mongoose.Types.ObjectId.isValid(category);
  const categoryDoc = isCategoryObjectId
    ? await Category.findById(category)
    : await Category.findOne({ slug: category.toLowerCase() });

  if (!categoryDoc) {
    res.status(400);
    throw new Error(`Referenced category '${category}' does not exist`);
  }

  if (!categoryDoc.isActive) {
    res.status(400);
    throw new Error(`Referenced category '${categoryDoc.name}' is currently inactive`);
  }

  // 3. Prevent Duplicate Product Slug
  const cleanSlug = slug.toLowerCase().trim();
  const existingProduct = await Product.findOne({ slug: cleanSlug });

  if (existingProduct) {
    res.status(400);
    throw new Error(`Product with slug '${slug}' already exists`);
  }

  // 4. Create Product
  const product = await Product.create({
    name: name.trim(),
    slug: cleanSlug,
    description: description.trim(),
    shortDescription: shortDescription || '',
    category: categoryDoc._id,
    images,
    videos: videos || {},
    marketplaceOffers,
    rating: rating || 0,
    reviewCount: reviewCount || 0,
    editorialRating: editorialRating || undefined,
    discountPercent: discountPercent || 0,
    keyFeatures: keyFeatures || [],
    specs: specs || {},
    pros: pros || [],
    cons: cons || [],
    isPublished: isPublished !== undefined ? isPublished : true,
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    isTrending: isTrending !== undefined ? isTrending : false,
    isActive: isActive !== undefined ? isActive : true
  });

  const populatedProduct = await Product.findById(product._id).populate('category', '_id name slug icon');

  res.status(201).json({
    success: true,
    data: populatedProduct
  });
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public (Admin)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const product = isObjectId
    ? await Product.findById(id)
    : await Product.findOne({ slug: id.toLowerCase() });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // If category is being updated, verify new category
  if (req.body.category) {
    const isCatObjectId = mongoose.Types.ObjectId.isValid(req.body.category);
    const categoryDoc = isCatObjectId
      ? await Category.findById(req.body.category)
      : await Category.findOne({ slug: req.body.category.toLowerCase() });

    if (!categoryDoc) {
      res.status(400);
      throw new Error(`Referenced category '${req.body.category}' does not exist`);
    }

    if (!categoryDoc.isActive) {
      res.status(400);
      throw new Error(`Referenced category '${categoryDoc.name}' is inactive`);
    }

    req.body.category = categoryDoc._id;
  }

  // If slug is being updated, verify no conflict
  if (req.body.slug && req.body.slug.toLowerCase() !== product.slug) {
    const cleanSlug = req.body.slug.toLowerCase().trim();
    const slugConflict = await Product.findOne({ slug: cleanSlug });
    if (slugConflict) {
      res.status(400);
      throw new Error(`Product slug '${cleanSlug}' is already in use`);
    }
    req.body.slug = cleanSlug;
  }

  // Update fields
  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  const populated = await Product.findById(updatedProduct._id).populate('category', '_id name slug icon');

  res.status(200).json({
    success: true,
    data: populated
  });
});

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Public (Admin)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = mongoose.Types.ObjectId.isValid(id);

  const product = isObjectId
    ? await Product.findById(id)
    : await Product.findOne({ slug: id.toLowerCase() });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});
