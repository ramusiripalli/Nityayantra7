import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new collection
 * @route   POST /api/collections
 * @access  Private (Admin)
 */
export const createCollection = asyncHandler(async (req, res) => {
  const { 
    name, 
    slug, 
    description, 
    image = '',
    icon = '🍟',
    category,
    seoTitle, 
    seoDescription, 
    products = [], 
    isPublished = true,
    isFeatured = false 
  } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Collection name is required');
  }

  if (!slug || !slug.trim()) {
    res.status(400);
    throw new Error('Collection slug is required');
  }

  const cleanSlug = slug.toLowerCase().trim();
  const existing = await Collection.findOne({ slug: cleanSlug });
  if (existing) {
    res.status(400);
    throw new Error(`A collection with slug '${slug}' already exists`);
  }

  // Validate Category (Required Parent Category)
  if (!category || !mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Parent category is required');
  }

  const catExists = await Category.findById(category);
  if (!catExists) {
    res.status(400);
    throw new Error('Selected parent Category does not exist');
  }

  // Validate Products Array
  if (!Array.isArray(products)) {
    res.status(400);
    throw new Error('Products must be an array of product IDs');
  }

  // Check for duplicate products
  const stringIds = products.map((id) => String(id));
  const uniqueIds = new Set(stringIds);
  if (uniqueIds.size !== stringIds.length) {
    res.status(400);
    throw new Error('Duplicate products are not allowed in the same collection');
  }

  // Validate ObjectIds and verify products exist
  for (const pId of products) {
    if (!mongoose.Types.ObjectId.isValid(pId)) {
      res.status(400);
      throw new Error(`Invalid Product ID: ${pId}`);
    }
  }

  if (products.length > 0) {
    const existingProductsCount = await Product.countDocuments({ _id: { $in: products } });
    if (existingProductsCount !== products.length) {
      res.status(400);
      throw new Error('One or more selected products do not exist in the database');
    }
  }

  const collection = await Collection.create({
    name: name.trim(),
    slug: cleanSlug,
    description: description ? description.trim() : '',
    image: image ? image.trim() : '',
    icon: icon ? icon.trim() : '🍟',
    category,
    seoTitle: seoTitle ? seoTitle.trim() : `${name.trim()} in India | Nitya Yantra`,
    seoDescription: seoDescription
      ? seoDescription.trim()
      : `Discover our curated selection of ${name.trim()} with real marketplace prices.`,
    products,
    isPublished: Boolean(isPublished),
    isFeatured: Boolean(isFeatured),
  });

  // Sync collectionId on assigned products
  if (products.length > 0) {
    await Product.updateMany(
      { _id: { $in: products } },
      { $set: { collectionId: collection._id } }
    );
  }

  res.status(201).json({
    success: true,
    data: collection,
  });
});

/**
 * @desc    Get all collections (Admin)
 * @route   GET /api/collections
 * @access  Private (Admin)
 */
export const getCollections = asyncHandler(async (req, res) => {
  const { search, published, category, featured } = req.query;
  const filter = {};

  if (published !== undefined) {
    filter.isPublished = published === 'true';
  }

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (search && search.trim()) {
    filter.name = new RegExp(search.trim(), 'i');
  }

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const catDoc = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (catDoc) filter.category = catDoc._id;
    }
  }

  const collections = await Collection.find(filter)
    .sort({ createdAt: -1 })
    .populate('category', 'name slug')
    .populate('products', '_id productId name images lowestPrice');

  res.status(200).json({
    success: true,
    data: collections,
  });
});

/**
 * @desc    Get collection by ID (Admin)
 * @route   GET /api/collections/:id
 * @access  Private (Admin)
 */
export const getCollectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Collection ID');
  }

  const collection = await Collection.findById(id)
    .populate('category', 'name slug')
    .populate({
      path: 'products',
      populate: { path: 'category', select: 'name slug' },
    });

  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }

  res.status(200).json({
    success: true,
    data: collection,
  });
});

/**
 * @desc    Update a collection
 * @route   PUT /api/collections/:id
 * @access  Private (Admin)
 */
export const updateCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    slug, 
    description, 
    image,
    icon,
    category,
    seoTitle, 
    seoDescription, 
    products, 
    isPublished,
    isFeatured 
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Collection ID');
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }

  if (isFeatured !== undefined) collection.isFeatured = Boolean(isFeatured);

  if (slug && slug.trim()) {
    const cleanSlug = slug.toLowerCase().trim();
    if (cleanSlug !== collection.slug) {
      const existing = await Collection.findOne({ slug: cleanSlug });
      if (existing) {
        res.status(400);
        throw new Error(`A collection with slug '${slug}' already exists`);
      }
      collection.slug = cleanSlug;
    }
  }

  if (name !== undefined) collection.name = name.trim();
  if (description !== undefined) collection.description = description.trim();
  if (image !== undefined) collection.image = image.trim();
  if (icon !== undefined) collection.icon = icon.trim();
  
  if (category !== undefined) {
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      const catExists = await Category.findById(category);
      if (!catExists) {
        res.status(400);
        throw new Error('Selected parent Category does not exist');
      }
      collection.category = category;
    }
  }

  if (seoTitle !== undefined) collection.seoTitle = seoTitle.trim();
  if (seoDescription !== undefined) collection.seoDescription = seoDescription.trim();
  if (isPublished !== undefined) collection.isPublished = Boolean(isPublished);

  if (products !== undefined) {
    if (!Array.isArray(products)) {
      res.status(400);
      throw new Error('Products must be an array of product IDs');
    }

    // Check duplicate IDs
    const stringIds = products.map((pid) => String(pid));
    const uniqueIds = new Set(stringIds);
    if (uniqueIds.size !== stringIds.length) {
      res.status(400);
      throw new Error('Duplicate products are not allowed in the same collection');
    }

    // Validate ObjectIds and existence
    for (const pid of products) {
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        res.status(400);
        throw new Error(`Invalid Product ID: ${pid}`);
      }
    }

    if (products.length > 0) {
      const existingProductsCount = await Product.countDocuments({ _id: { $in: products } });
      if (existingProductsCount !== products.length) {
        res.status(400);
        throw new Error('One or more selected products do not exist in the database');
      }
    }

    collection.products = products;

    // Sync collectionId on products
    await Product.updateMany(
      { _id: { $in: products } },
      { $set: { collectionId: collection._id } }
    );
  }

  const updatedCollection = await collection.save();

  res.status(200).json({
    success: true,
    data: updatedCollection,
  });
});

/**
 * @desc    Delete a collection (with Delete Protection)
 * @route   DELETE /api/collections/:id
 * @access  Private (Admin)
 */
export const deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid Collection ID');
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    res.status(404);
    throw new Error('Collection not found');
  }

  // DELETE PROTECTION: Check if any products are assigned to this collection
  const assignedProductsCount = await Product.countDocuments({
    $or: [
      { collectionId: collection._id },
      { _id: { $in: collection.products || [] } },
    ],
  });

  if (assignedProductsCount > 0) {
    res.status(409);
    throw new Error(
      'Cannot delete this collection because products are assigned to it. Move or remove the products first.'
    );
  }

  await collection.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Collection deleted successfully',
  });
});

/**
 * @desc    Get all published collections (Public)
 * @route   GET /api/collections/public
 * @access  Public
 */
export const getPublicCollections = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = { isPublished: true };

  if (featured !== undefined) {
    filter.isFeatured = featured === 'true';
  }

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const catDoc = await Category.findOne({ slug: category.toLowerCase().trim() });
      if (catDoc) {
        filter.category = catDoc._id;
      } else {
        return res.status(200).json({ success: true, data: [] });
      }
    }
  }

  const collections = await Collection.find(filter)
    .sort({ createdAt: -1 })
    .populate('category', 'name slug icon')
    .populate({
      path: 'products',
      match: { isPublished: true, isActive: true },
      select: '_id productId name lowestPrice images',
    });

  // Also count products that have collectionId pointing to this collection
  const data = await Promise.all(
    collections.map(async (col) => {
      const directCount = await Product.countDocuments({
        collectionId: col._id,
        isPublished: true,
        isActive: true,
      });
      const arrayCount = col.products?.length || 0;
      const count = Math.max(directCount, arrayCount);

      return {
        _id: col._id,
        name: col.name,
        slug: col.slug,
        description: col.description,
        image: col.image || '',
        icon: col.icon || '🍟',
        category: col.category,
        productCount: count,
        isFeatured: Boolean(col.isFeatured),
      };
    })
  );

  res.status(200).json({
    success: true,
    data,
  });
});

/**
 * @desc    Get published collection by slug (Public)
 * @route   GET /api/collections/public/:slug
 * @access  Public
 */
export const getPublicCollectionBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug || !slug.trim()) {
    res.status(404);
    throw new Error('Collection not found');
  }

  const cleanSlug = slug.toLowerCase().trim();

  // Find published collection
  const collection = await Collection.findOne({ slug: cleanSlug, isPublished: true })
    .populate('category', 'name slug');

  if (!collection) {
    res.status(404);
    throw new Error('Collection not found or currently unpublished');
  }

  // Populate active, published products via array or collectionId
  const populated = await Collection.findById(collection._id).populate({
    path: 'products',
    match: { isPublished: true, isActive: true },
    populate: { path: 'category', select: 'name slug' },
  });

  // Preserve the exact order of products specified by the admin
  const productMap = new Map();
  if (populated.products && Array.isArray(populated.products)) {
    populated.products.forEach((p) => {
      productMap.set(String(p._id), p);
    });
  }

  // Also include any products with collectionId: collection._id that might not be in the array
  const extraProducts = await Product.find({
    collectionId: collection._id,
    _id: { $nin: Array.from(productMap.keys()) },
    isPublished: true,
    isActive: true,
  }).populate('category', 'name slug');

  extraProducts.forEach((p) => {
    productMap.set(String(p._id), p);
  });

  const orderedProducts = [
    ...collection.products.map((id) => productMap.get(String(id))).filter(Boolean),
    ...extraProducts,
  ];

  const responseData = {
    _id: collection._id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    image: collection.image || '',
    icon: collection.icon || '🍟',
    category: collection.category,
    seoTitle: collection.seoTitle || `${collection.name} in India | Nitya Yantra`,
    seoDescription: collection.seoDescription || `Discover our curated selection of ${collection.name}.`,
    productCount: orderedProducts.length,
    products: orderedProducts,
    updatedAt: collection.updatedAt,
  };

  res.status(200).json({
    success: true,
    data: responseData,
  });
});
