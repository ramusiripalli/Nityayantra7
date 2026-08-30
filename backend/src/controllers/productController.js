import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * Extract YouTube Video ID from standard or shortened YouTube URLs
 */
const extractYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
};

/**
 * Validate HTTP/HTTPS image URL format
 */
const isValidHttpUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
};

/**
 * Calculate highest discount percentage from marketplace offers
 */
const calculateHighestDiscount = (offers) => {
  if (!offers || !Array.isArray(offers) || offers.length === 0) return 0;
  const discounts = offers.map((o) => {
    if (o.originalPrice && o.originalPrice > o.price) {
      return Math.round(((o.originalPrice - o.price) / o.originalPrice) * 100);
    }
    return o.discount || 0;
  });
  return Math.max(0, ...discounts);
};

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

  // 1. Published Status Filter (Admin query can request published=all)
  if (published === 'all') {
    // Admin request for all published and unpublished products
  } else if (published !== undefined) {
    query.isPublished = published === 'true';
  } else {
    query.isPublished = true; // Public default
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
      const catObj = await Category.findOne({ slug: category.toLowerCase() });
      if (catObj) {
        query.category = catObj._id;
      } else {
        return res.status(200).json({
          success: true,
          count: 0,
          total: 0,
          page: 1,
          pages: 0,
          data: {
            products: [],
            pagination: { page: 1, limit: 12, total: 0, pages: 0 },
            filters: { category: null }
          }
        });
      }
    }
  }

  // 3b. Collection / Subcategory Filter (by slug or ObjectId)
  if (req.query.collection && req.query.collection !== 'all') {
    const colParam = req.query.collection.toLowerCase().trim();
    const colDoc = mongoose.Types.ObjectId.isValid(colParam)
      ? await Collection.findById(colParam)
      : await Collection.findOne({ slug: colParam });

    if (colDoc) {
      query.$or = [
        { collectionId: colDoc._id },
        { _id: { $in: colDoc.products || [] } }
      ];
    }
  }

  // 4. Exact numeric Product ID search OR Full Text/Category/Collection Search
  if (search && search.trim() !== '') {
    const trimmed = search.trim();
    const isPureNumeric = /^\d+$/.test(trimmed);

    if (isPureNumeric) {
      // Pure numeric search is exact for Product ID
      query.$or = [
        { productId: parseInt(trimmed, 10) }
      ];
    } else {
      const searchRegex = new RegExp(trimmed, 'i');
      const orConditions = [
        { name: searchRegex },
        { description: searchRegex },
        { keyFeatures: searchRegex },
        { shortDescription: searchRegex }
      ];

      // Match category names
      const matchingCats = await Category.find({ name: searchRegex }, { _id: 1 });
      if (matchingCats.length > 0) {
        orConditions.push({ category: { $in: matchingCats.map((c) => c._id) } });
      }

      // Match collection names
      const matchingCollections = await Collection.find(
        { name: searchRegex, isPublished: true },
        { products: 1 }
      );
      if (matchingCollections.length > 0) {
        const collectionProductIds = matchingCollections.flatMap((c) => c.products || []);
        if (collectionProductIds.length > 0) {
          orConditions.push({ _id: { $in: collectionProductIds } });
        }
      }

      query.$or = orConditions;
    }
  }

  // 5. Sorting Options
  let sortOption = { createdAt: -1 };

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
    .populate('collectionId', '_id name slug image icon')
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
    ? await Product.findById(id).populate('category', '_id name slug icon').populate('collectionId', '_id name slug image icon')
    : await Product.findOne({ slug: id.toLowerCase() }).populate('category', '_id name slug icon').populate('collectionId', '_id name slug image icon');

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
 * @access  Private (Admin)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    shortDescription,
    category,
    collectionId,
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
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Product name is required');
  }

  if (!slug || !slug.trim()) {
    res.status(400);
    throw new Error('Product slug is required');
  }

  if (!description || !description.trim()) {
    res.status(400);
    throw new Error('Product description is required');
  }

  if (!category) {
    res.status(400);
    throw new Error('Category reference is required');
  }

  if (!images || !Array.isArray(images) || images.length === 0 || !images[0]?.url) {
    res.status(400);
    throw new Error('At least one product image with a valid URL is required');
  }

  // Validate all image URLs start with http:// or https://
  for (const img of images) {
    if (!img.url || !isValidHttpUrl(img.url)) {
      res.status(400);
      throw new Error('Product image URL must be a valid HTTP or HTTPS address');
    }
  }

  if (!marketplaceOffers || !Array.isArray(marketplaceOffers) || marketplaceOffers.length === 0 || !marketplaceOffers[0]?.url || marketplaceOffers[0]?.price === undefined) {
    res.status(400);
    throw new Error('At least one marketplace offer with a valid URL and price is required');
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

  // 4. Auto-extract YouTube Video ID if omitted
  const formattedVideos = { ...videos };
  if (formattedVideos.youtubeUrl && !formattedVideos.youtubeVideoId) {
    formattedVideos.youtubeVideoId = extractYouTubeVideoId(formattedVideos.youtubeUrl);
  }

  // 5. Calculate fallback discountPercent if omitted
  const finalDiscountPercent =
    discountPercent !== undefined && discountPercent > 0
      ? discountPercent
      : calculateHighestDiscount(marketplaceOffers);

  // 6. Create Product
  const product = await Product.create({
    name: name.trim(),
    slug: cleanSlug,
    description: description.trim(),
    shortDescription: shortDescription ? shortDescription.trim() : '',
    category: categoryDoc._id,
    collectionId: collectionId && mongoose.Types.ObjectId.isValid(collectionId) ? collectionId : undefined,
    images,
    videos: formattedVideos,
    marketplaceOffers,
    rating: rating !== undefined ? Number(rating) : 0,
    reviewCount: reviewCount !== undefined ? Number(reviewCount) : 0,
    editorialRating: editorialRating !== undefined && editorialRating !== '' ? Number(editorialRating) : undefined,
    discountPercent: Number(finalDiscountPercent),
    keyFeatures: keyFeatures || [],
    specs: specs || {},
    pros: pros || [],
    cons: cons || [],
    isPublished: isPublished !== undefined ? isPublished : true,
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    isTrending: isTrending !== undefined ? isTrending : false,
    isActive: isActive !== undefined ? isActive : true
  });

  // If assigned to a collection, ensure product ID is in collection.products
  if (collectionId && mongoose.Types.ObjectId.isValid(collectionId)) {
    await Collection.findByIdAndUpdate(collectionId, {
      $addToSet: { products: product._id }
    });
  }

  const populatedProduct = await Product.findById(product._id)
    .populate('category', '_id name slug icon')
    .populate('collectionId', '_id name slug image icon');

  res.status(201).json({
    success: true,
    data: populatedProduct
  });
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
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
  if (req.body.slug && req.body.slug.toLowerCase().trim() !== product.slug) {
    const cleanSlug = req.body.slug.toLowerCase().trim();
    const slugConflict = await Product.findOne({ slug: cleanSlug });
    if (slugConflict) {
      res.status(400);
      throw new Error(`Product slug '${cleanSlug}' is already in use`);
    }
    req.body.slug = cleanSlug;
  }

  // Validate image URLs if provided
  if (req.body.images && Array.isArray(req.body.images)) {
    if (req.body.images.length === 0) {
      res.status(400);
      throw new Error('At least one product image with a valid URL is required');
    }
    for (const img of req.body.images) {
      if (!img.url || !isValidHttpUrl(img.url)) {
        res.status(400);
        throw new Error('Product image URL must be a valid HTTP or HTTPS address');
      }
    }
  }

  // Auto-extract YouTube Video ID if omitted
  if (req.body.videos && req.body.videos.youtubeUrl && !req.body.videos.youtubeVideoId) {
    req.body.videos.youtubeVideoId = extractYouTubeVideoId(req.body.videos.youtubeUrl);
  }

  // Auto-calculate discountPercent if omitted/zero
  if (req.body.marketplaceOffers && (!req.body.discountPercent || req.body.discountPercent === 0)) {
    req.body.discountPercent = calculateHighestDiscount(req.body.marketplaceOffers);
  }

  // Handle collectionId update
  if (req.body.collectionId !== undefined) {
    if (req.body.collectionId && mongoose.Types.ObjectId.isValid(req.body.collectionId)) {
      product.collectionId = req.body.collectionId;
      await Collection.findByIdAndUpdate(req.body.collectionId, {
        $addToSet: { products: product._id }
      });
    } else {
      product.collectionId = undefined;
    }
  }

  // Update fields
  Object.assign(product, req.body);
  const updatedProduct = await product.save();
  const populated = await Product.findById(updatedProduct._id)
    .populate('category', '_id name slug icon')
    .populate('collectionId', '_id name slug image icon');

  res.status(200).json({
    success: true,
    data: populated
  });
});

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
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
