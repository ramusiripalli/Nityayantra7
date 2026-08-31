import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import Category from '../src/models/Category.js';
import Collection from '../src/models/Collection.js';
import Product from '../src/models/Product.js';
import User from '../src/models/User.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nitya-yantra';

// 1. Core Top-Level Categories Specification (with existing DB slug mapping & aliases)
const CATEGORIES_DATA = [
  { name: 'Kitchen', slug: 'kitchen', aliases: ['kitchen'], icon: 'ChefHat', description: 'Smart kitchen gadgets, air fryers, kettles and cookware' },
  { name: 'Electronics & Tech', slug: 'electronics-tech', aliases: ['electronics', 'gadgets'], icon: 'Zap', description: 'Wireless earbuds, smart audio, chargers and tech essentials' },
  { name: 'Home', slug: 'home', aliases: ['home'], icon: 'Home', description: 'Smart cleaning gadgets, robovacs, and home utilities' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', aliases: ['beauty'], icon: 'Sparkles', description: 'Skin care, grooming essentials and personal wellness' },
  { name: 'Fitness & Wellness', slug: 'fitness-wellness', aliases: ['fitness'], icon: 'Dumbbell', description: 'Fitness trackers, yoga and health gadgets' },
  { name: 'Mobile Accessories', slug: 'mobile-accessories', aliases: ['mobiles'], icon: 'Smartphone', description: 'Phones, fast power banks, cases and cables' },
  { name: 'Kids & Fun', slug: 'kids-fun', aliases: ['toys'], icon: 'Gamepad2', description: 'Educational toys, family board games and collectibles' },
  { name: 'Office & Study', slug: 'office-study', aliases: ['office'], icon: 'BookOpen', description: 'Ergonomic mice, desk mats, routers and study tools' },
  { name: 'Trending Deals', slug: 'deals', aliases: ['deals'], icon: 'Flame', description: 'Top price drops and verified marketplace deals' },
];

// 2. Core Collections Specification
const COLLECTIONS_DATA = [
  // Kitchen
  { name: 'Air Fryers', slug: 'air-fryers', categorySlug: 'kitchen', icon: '🍟', isFeatured: true, description: 'Compare popular air fryers and find where to buy.' },
  { name: 'Mixer Grinders', slug: 'mixer-grinders', categorySlug: 'kitchen', icon: '⚙️', isFeatured: false, description: 'Durable heavy-duty mixer grinders and blenders.' },
  { name: 'Electric Kettles', slug: 'electric-kettles', categorySlug: 'kitchen', icon: '🫖', isFeatured: false, description: 'Fast boiling stainless steel & glass electric kettles.' },
  { name: 'Kitchen Gadgets', slug: 'kitchen-gadgets', categorySlug: 'kitchen', icon: '🍳', isFeatured: false, description: 'Useful tools and smart gadgets for everyday cooking.' },

  // Electronics
  { name: 'Wireless Earbuds', slug: 'wireless-earbuds', categorySlug: 'electronics-tech', icon: '🎧', isFeatured: true, description: 'Explore popular true wireless earbuds with ANC & bass.' },
  { name: 'Smart Watches', slug: 'smart-watches', categorySlug: 'electronics-tech', icon: '⌚', isFeatured: false, description: 'Bluetooth calling, fitness tracking smart watches.' },
  { name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', categorySlug: 'electronics-tech', icon: '🔊', isFeatured: false, description: 'Portable party and outdoor bluetooth speakers.' },

  // Home
  { name: 'Robot Vacuums & Mops', slug: 'robot-vacuums', categorySlug: 'home', icon: '🤖', isFeatured: false, description: 'Hands-free automatic vacuuming and mopping cleaners.' },
  { name: 'Cleaning Gadgets', slug: 'cleaning-gadgets', categorySlug: 'home', icon: '🧹', isFeatured: false, description: 'Smart scrubbers, lint removers and cleaning accessories.' },

  // Beauty
  { name: 'Face Serums & Skincare', slug: 'face-serums', categorySlug: 'beauty-personal-care', icon: '✨', isFeatured: false, description: 'Science-backed facial serums, sunscreens and skincare.' },

  // Mobiles
  { name: 'Budget 5G Phones', slug: 'budget-5g-phones', categorySlug: 'mobile-accessories', icon: '📱', isFeatured: false, description: 'Best value 5G smartphones under ₹20,000.' },
  { name: 'Power Banks & Chargers', slug: 'chargers-powerbanks', categorySlug: 'mobile-accessories', icon: '🔋', isFeatured: false, description: 'Fast charging high capacity power banks and adapters.' },

  // Kids & Toys
  { name: 'Board Games & Toys', slug: 'board-games', categorySlug: 'kids-fun', icon: '🎲', isFeatured: false, description: 'Classic family board games and interactive playsets.' },

  // Office & Study
  { name: 'Desk & PC Accessories', slug: 'desk-accessories', categorySlug: 'office-study', icon: '💻', isFeatured: false, description: 'High performance ergonomic mice, Wi-Fi routers and drives.' },
];

export async function runMigration() {
  console.log('========================================================');
  console.log('  NITYA YANTRA — STATIC TO MONGODB DATA MIGRATION');
  console.log('========================================================');
  console.log('Connecting to MongoDB...');
  await connectDB();
  console.log('✅ Connected to MongoDB successfully.\n');

  // ----------------------------------------------------
  // STEP 1: Idempotent Categories Upsert
  // ----------------------------------------------------
  console.log('--- Step 1: Upserting Top-Level Categories ---');
  const categoryMap = new Map();

  for (const cat of CATEGORIES_DATA) {
    let existing = await Category.findOne({
      $or: [{ slug: cat.slug }, { name: cat.name }],
    });

    if (existing) {
      existing.name = cat.name;
      existing.icon = cat.icon;
      existing.description = cat.description;
      existing.isActive = true;
      await existing.save();
    } else {
      existing = await Category.create({
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        isActive: true,
      });
    }

    categoryMap.set(cat.slug, existing);
    if (cat.aliases) {
      for (const alias of cat.aliases) {
        categoryMap.set(alias, existing);
      }
    }
    console.log(`  ✓ Category [${existing.slug}]: ${existing.name} (${existing._id})`);
  }

  // ----------------------------------------------------
  // STEP 2: Idempotent Collections Upsert
  // ----------------------------------------------------
  console.log('\n--- Step 2: Upserting Curated Collections ---');
  const collectionMap = new Map();

  for (const col of COLLECTIONS_DATA) {
    const parentCategory = categoryMap.get(col.categorySlug);
    if (!parentCategory) {
      console.warn(`  ⚠️ Parent category not found for collection: ${col.slug}`);
      continue;
    }

    let existing = await Collection.findOne({
      $or: [{ slug: col.slug }, { name: col.name, category: parentCategory._id }],
    });

    if (existing) {
      existing.name = col.name;
      existing.slug = col.slug;
      existing.description = col.description;
      existing.icon = col.icon;
      existing.category = parentCategory._id;
      existing.isPublished = true;
      existing.isFeatured = col.isFeatured || false;
      await existing.save();
    } else {
      existing = await Collection.create({
        name: col.name,
        slug: col.slug,
        description: col.description,
        icon: col.icon,
        category: parentCategory._id,
        isPublished: true,
        isFeatured: col.isFeatured || false,
      });
    }

    collectionMap.set(col.slug, existing);
    console.log(`  ✓ Collection [${existing.slug}]: ${existing.name} -> Under ${parentCategory.name}`);
  }

  // ----------------------------------------------------
  // STEP 3: Load Existing Mock Products from frontend/src/data/mockProducts.js
  // ----------------------------------------------------
  console.log('\n--- Step 3: Loading Static Mock Products ---');
  
  const mockProductsPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../frontend/src/data/mockProducts.js'
  );
  
  const { MOCK_PRODUCTS } = await import(pathToFileURL(mockProductsPath).href);
  console.log(`Found ${MOCK_PRODUCTS.length} static mock products to migrate.\n`);

  // ----------------------------------------------------
  // STEP 4: Idempotent Product Migration
  // ----------------------------------------------------
  console.log('--- Step 4: Upserting Products with Marketplace Offers ---');
  let migratedCount = 0;

  for (const item of MOCK_PRODUCTS) {
    const numericId = parseInt(item.id, 10);
    if (isNaN(numericId)) continue;

    // Determine category
    const catSlug = (item.category || 'kitchen').toLowerCase();
    const parentCategory =
      categoryMap.get(catSlug) ||
      categoryMap.get('kitchen');

    // Determine matching collection
    const titleLower = (item.title || '').toLowerCase();
    let targetColSlug = 'kitchen-gadgets';

    if (catSlug === 'kitchen') {
      if (titleLower.includes('air fryer') || titleLower.includes('airfryer')) {
        targetColSlug = 'air-fryers';
      } else if (titleLower.includes('kettle')) {
        targetColSlug = 'electric-kettles';
      } else if (titleLower.includes('mixer') || titleLower.includes('grinder')) {
        targetColSlug = 'mixer-grinders';
      } else {
        targetColSlug = 'kitchen-gadgets';
      }
    } else if (catSlug === 'electronics') {
      if (titleLower.includes('earbuds') || titleLower.includes('airdopes')) {
        targetColSlug = 'wireless-earbuds';
      } else if (titleLower.includes('speaker')) {
        targetColSlug = 'bluetooth-speakers';
      } else {
        targetColSlug = 'wireless-earbuds';
      }
    } else if (catSlug === 'gadgets') {
      if (titleLower.includes('smartwatch') || titleLower.includes('watch')) {
        targetColSlug = 'smart-watches';
      } else if (titleLower.includes('power bank') || titleLower.includes('charger')) {
        targetColSlug = 'chargers-powerbanks';
      } else if (titleLower.includes('mouse') || titleLower.includes('router') || titleLower.includes('drive')) {
        targetColSlug = 'desk-accessories';
      } else {
        targetColSlug = 'smart-watches';
      }
    } else if (catSlug === 'home') {
      if (titleLower.includes('vac') || titleLower.includes('mop') || titleLower.includes('cleaner')) {
        targetColSlug = 'robot-vacuums';
      } else {
        targetColSlug = 'cleaning-gadgets';
      }
    } else if (catSlug === 'beauty') {
      targetColSlug = 'face-serums';
    } else if (catSlug === 'mobiles') {
      targetColSlug = 'budget-5g-phones';
    } else if (catSlug === 'toys') {
      targetColSlug = 'board-games';
    }

    const assignedCollection = collectionMap.get(targetColSlug);

    // Build real marketplace offers for this product
    const currentPrice = item.currentPrice || 999;
    const originalPrice = item.originalPrice || Math.round(currentPrice * 1.35);
    const discount = item.discountPercent || Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    const lowestStore = (item.lowestMarketplace || 'amazon').toLowerCase();

    const marketplaceOffers = [
      {
        marketplace: 'amazon',
        price: lowestStore === 'amazon' ? currentPrice : Math.round(currentPrice * 1.03),
        originalPrice,
        discount: lowestStore === 'amazon' ? discount : Math.max(0, discount - 3),
        url: `https://www.amazon.in/s?k=${encodeURIComponent(item.title)}`,
        productUrl: `https://www.amazon.in/s?k=${encodeURIComponent(item.title)}`,
        affiliateUrl: `https://www.amazon.in/s?k=${encodeURIComponent(item.title)}&tag=nityayantra-21`,
        deliveryText: 'Free Prime Delivery',
        isAvailable: true,
        lastCheckedAt: new Date(),
      },
      {
        marketplace: 'flipkart',
        price: lowestStore === 'flipkart' ? currentPrice : Math.round(currentPrice * 1.04),
        originalPrice,
        discount: lowestStore === 'flipkart' ? discount : Math.max(0, discount - 4),
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(item.title)}`,
        productUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(item.title)}`,
        affiliateUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(item.title)}&affid=nityayantra`,
        deliveryText: 'Free Delivery',
        isAvailable: true,
        lastCheckedAt: new Date(),
      },
      {
        marketplace: 'meesho',
        price: lowestStore === 'meesho' ? currentPrice : Math.round(currentPrice * 1.06),
        originalPrice,
        discount: lowestStore === 'meesho' ? discount : Math.max(0, discount - 6),
        url: `https://www.meesho.com/search?q=${encodeURIComponent(item.title)}`,
        productUrl: `https://www.meesho.com/search?q=${encodeURIComponent(item.title)}`,
        affiliateUrl: `https://www.meesho.com/search?q=${encodeURIComponent(item.title)}`,
        deliveryText: 'Standard Delivery',
        isAvailable: true,
        lastCheckedAt: new Date(),
      },
    ];

    // Specialized Air Fryer overrides for verified product IDs
    if (numericId === 1) {
      item.image = 'https://m.media-amazon.com/images/I/51wXUqH7E8L._SX679_.jpg';
      marketplaceOffers[0].url = 'https://www.amazon.in/dp/B097RJ867P';
      marketplaceOffers[0].productUrl = 'https://www.amazon.in/dp/B097RJ867P';
      marketplaceOffers[0].price = 5399;
      marketplaceOffers[1].price = 5699;
      marketplaceOffers[2].price = 5899;
    } else if (numericId === 2) {
      marketplaceOffers[0].price = item.currentPrice;
      marketplaceOffers[1].price = Math.round(item.currentPrice * 1.05);
    }

    // Check if product exists by productId
    let existingProd = await Product.findOne({ productId: numericId });
    const productSlug = existingProd?.slug || item.slug || `product-${numericId}`;

    if (existingProd) {
      existingProd.name = item.title;
      existingProd.slug = productSlug;
      existingProd.description = item.shortDescription || item.title;
      existingProd.shortDescription = item.shortDescription || '';
      existingProd.category = parentCategory._id;
      existingProd.collectionId = assignedCollection ? assignedCollection._id : null;
      existingProd.images = [{ url: item.image, alt: item.title }];
      existingProd.marketplaceOffers = marketplaceOffers;
      existingProd.rating = item.rating || 4.2;
      existingProd.reviewCount = item.reviewCount || 100;
      existingProd.editorialRating = item.editorialRating || 4.5;
      existingProd.discountPercent = discount;
      existingProd.originalPrice = originalPrice;
      existingProd.isPublished = true;
      existingProd.isFeatured = Boolean(item.isFeatured);
      existingProd.isTrending = Boolean(item.isTrending);
      existingProd.isActive = true;
      await existingProd.save();
    } else {
      existingProd = await Product.create({
        productId: numericId,
        name: item.title,
        slug: productSlug,
        description: item.shortDescription || item.title,
        shortDescription: item.shortDescription || '',
        category: parentCategory._id,
        collectionId: assignedCollection ? assignedCollection._id : null,
        images: [{ url: item.image, alt: item.title }],
        marketplaceOffers,
        rating: item.rating || 4.2,
        reviewCount: item.reviewCount || 100,
        editorialRating: item.editorialRating || 4.5,
        discountPercent: discount,
        originalPrice,
        isPublished: true,
        isFeatured: Boolean(item.isFeatured),
        isTrending: Boolean(item.isTrending),
        isActive: true,
      });
    }

    migratedCount++;
    console.log(
      `  ✓ Product #${numericId}: ${existingProd.name.substring(0, 40)}... (Col: ${assignedCollection?.name || 'None'})`
    );
  }

  // ----------------------------------------------------
  // STEP 5: Synchronize Collection `products` array
  // ----------------------------------------------------
  console.log('\n--- Step 5: Synchronizing Collection Product References ---');
  for (const [colSlug, colDoc] of collectionMap.entries()) {
    const assignedProducts = await Product.find({ collectionId: colDoc._id }, { _id: 1 });
    const productIds = assignedProducts.map((p) => p._id);

    let updateFields = { products: productIds };
    if (!colDoc.image && assignedProducts.length > 0) {
      const sampleProd = await Product.findById(assignedProducts[0]._id);
      if (sampleProd && sampleProd.images && sampleProd.images[0]) {
        updateFields.image = sampleProd.images[0].url;
      }
    }

    await Collection.findByIdAndUpdate(colDoc._id, { $set: updateFields });
    console.log(`  ✓ Collection [${colSlug}]: Synced ${productIds.length} products.`);
  }

  // ----------------------------------------------------
  // STEP 6: Ensure Default Admin User Exists
  // ----------------------------------------------------
  console.log('\n--- Step 6: Ensuring Admin User Exists ---');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nityayantra.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Nitya Yantra Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@NityaYantra2026',
      role: 'admin',
      isActive: true,
    });
    console.log(`  ✓ Created initial Admin User: ${adminEmail}`);
  } else {
    console.log(`  ✓ Admin User already exists: ${adminEmail}`);
  }

  console.log('\n========================================================');
  console.log(`  🎉 MIGRATION COMPLETED! Total Products Migrated: ${migratedCount}`);
  console.log('========================================================\n');
}

// Run directly if script is executed from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigration()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration failed:', err);
      process.exit(1);
    });
}
