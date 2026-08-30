import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';
import Collection from '../src/models/Collection.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nitya-yantra';

async function seedData() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Find Kitchen Category
  const kitchen = await Category.findOne({ slug: 'kitchen' });
  if (!kitchen) {
    console.error('Kitchen category not found!');
    process.exit(1);
  }
  console.log('Kitchen category:', kitchen._id, kitchen.name);

  // 2. Find or Create Product #1 (Philips)
  let philips = await Product.findOne({ productId: 1 });
  if (!philips) {
    philips = await Product.create({
      productId: 1,
      name: 'PHILIPS Air fryer for Home HD9200/90, 4.1 Litre',
      slug: 'philips-air-fryer-hd9200-90',
      description: 'Rapid Air Technology with 1400W power and 4.1 Litre capacity.',
      category: kitchen._id,
      images: [{ url: 'https://m.media-amazon.com/images/I/51wXUqH7E8L._SX679_.jpg', alt: 'Philips Air Fryer' }],
      rating: 4.2,
      reviewCount: 4554,
      lowestPrice: 5399,
      marketplaceOffers: [
        { marketplace: 'amazon', price: 5399, originalPrice: 6995, discount: 23, url: 'https://www.amazon.in/dp/B097RJ867P', isAvailable: true },
        { marketplace: 'flipkart', price: 5699, originalPrice: 6995, discount: 19, url: 'https://www.flipkart.com/philips-hd9200-90-air-fryer/p/itm', isAvailable: true },
        { marketplace: 'meesho', price: 5899, originalPrice: 6995, discount: 16, url: 'https://www.meesho.com/philips-air-fryer/p/123', isAvailable: true }
      ],
      isPublished: true,
      isActive: true
    });
  } else {
    // Ensure accurate lowestPrice & offers
    philips.lowestPrice = 5399;
    philips.rating = 4.2;
    philips.reviewCount = 4554;
    philips.category = kitchen._id;
    philips.marketplaceOffers = [
      { marketplace: 'amazon', price: 5399, originalPrice: 6995, discount: 23, url: 'https://www.amazon.in/dp/B097RJ867P', isAvailable: true },
      { marketplace: 'flipkart', price: 5699, originalPrice: 6995, discount: 19, url: 'https://www.flipkart.com/philips-hd9200-90-air-fryer/p/itm', isAvailable: true },
      { marketplace: 'meesho', price: 5899, originalPrice: 6995, discount: 16, url: 'https://www.meesho.com/philips-air-fryer/p/123', isAvailable: true }
    ];
    await philips.save();
  }
  console.log('Product #1 (Philips) ready:', philips._id, philips.name);

  // 3. Find or Create Product #2 (Pigeon Air Fryer)
  let pigeon = await Product.findOne({ productId: 2 });
  if (!pigeon) {
    pigeon = await Product.create({
      productId: 2,
      name: 'Pigeon Healthifry Digital Air Fryer, 4.2 Litre',
      slug: 'pigeon-healthifry-digital-air-fryer-4-2-litre',
      description: 'Digital air fryer with 360 degree high speed air circulation technology and 1200W power.',
      category: kitchen._id,
      images: [{ url: 'https://m.media-amazon.com/images/I/61Nl8X11L9L._SX679_.jpg', alt: 'Pigeon Air Fryer' }],
      rating: 4.3,
      reviewCount: 2100,
      lowestPrice: 3999,
      marketplaceOffers: [
        { marketplace: 'amazon', price: 3999, originalPrice: 5995, discount: 33, url: 'https://www.amazon.in/dp/B08HRXPV5L', isAvailable: true },
        { marketplace: 'flipkart', price: 4199, originalPrice: 5995, discount: 30, url: 'https://www.flipkart.com/pigeon-air-fryer/p/itm', isAvailable: true },
        { marketplace: 'meesho', price: 4099, originalPrice: 5995, discount: 32, url: 'https://www.meesho.com/pigeon-air-fryer/p/456', isAvailable: true }
      ],
      isPublished: true,
      isActive: true
    });
  } else {
    pigeon.name = 'Pigeon Healthifry Digital Air Fryer, 4.2 Litre';
    pigeon.category = kitchen._id;
    pigeon.lowestPrice = 3999;
    pigeon.rating = 4.3;
    pigeon.reviewCount = 2100;
    pigeon.images = [{ url: 'https://m.media-amazon.com/images/I/61Nl8X11L9L._SX679_.jpg', alt: 'Pigeon Air Fryer' }];
    pigeon.marketplaceOffers = [
      { marketplace: 'amazon', price: 3999, originalPrice: 5995, discount: 33, url: 'https://www.amazon.in/dp/B08HRXPV5L', isAvailable: true },
      { marketplace: 'flipkart', price: 4199, originalPrice: 5995, discount: 30, url: 'https://www.flipkart.com/pigeon-air-fryer/p/itm', isAvailable: true },
      { marketplace: 'meesho', price: 4099, originalPrice: 5995, discount: 32, url: 'https://www.meesho.com/pigeon-air-fryer/p/456', isAvailable: true }
    ];
    await pigeon.save();
  }
  console.log('Product #2 (Pigeon) ready:', pigeon._id, pigeon.name);

  // 4. Find or Create Product #3 (AGARO Air Fryer)
  let agaro = await Product.findOne({ productId: 3 });
  if (!agaro) {
    agaro = await Product.create({
      productId: 3,
      name: 'AGARO Regency Digital Air Fryer, 4.5 Litre',
      slug: 'agaro-regency-digital-air-fryer-4-5-litre',
      description: 'Family size air fryer with digital touchscreen, 8 preset cooking options and 1400W.',
      category: kitchen._id,
      images: [{ url: 'https://m.media-amazon.com/images/I/71Yf1+L+7AL._SX679_.jpg', alt: 'AGARO Air Fryer' }],
      rating: 4.4,
      reviewCount: 1800,
      lowestPrice: 4299,
      marketplaceOffers: [
        { marketplace: 'amazon', price: 4299, originalPrice: 6499, discount: 34, url: 'https://www.amazon.in/dp/B0B69M4T4G', isAvailable: true },
        { marketplace: 'flipkart', price: 4499, originalPrice: 6499, discount: 31, url: 'https://www.flipkart.com/agaro-air-fryer/p/itm', isAvailable: true },
        { marketplace: 'myntra', price: 4599, originalPrice: 6499, discount: 29, url: 'https://www.myntra.com/agaro-air-fryer', isAvailable: true }
      ],
      isPublished: true,
      isActive: true
    });
  } else {
    agaro.name = 'AGARO Regency Digital Air Fryer, 4.5 Litre';
    agaro.category = kitchen._id;
    agaro.lowestPrice = 4299;
    agaro.rating = 4.4;
    agaro.reviewCount = 1800;
    agaro.images = [{ url: 'https://m.media-amazon.com/images/I/71Yf1+L+7AL._SX679_.jpg', alt: 'AGARO Air Fryer' }];
    agaro.marketplaceOffers = [
      { marketplace: 'amazon', price: 4299, originalPrice: 6499, discount: 34, url: 'https://www.amazon.in/dp/B0B69M4T4G', isAvailable: true },
      { marketplace: 'flipkart', price: 4499, originalPrice: 6499, discount: 31, url: 'https://www.flipkart.com/agaro-air-fryer/p/itm', isAvailable: true },
      { marketplace: 'myntra', price: 4599, originalPrice: 6499, discount: 29, url: 'https://www.myntra.com/agaro-air-fryer', isAvailable: true }
    ];
    await agaro.save();
  }
  console.log('Product #3 (AGARO) ready:', agaro._id, agaro.name);

  // 5. Update or Create Collection: Air Fryers
  let airFryerCol = await Collection.findOne({ slug: 'air-fryers' });
  if (!airFryerCol) {
    airFryerCol = await Collection.create({
      name: 'Air Fryers',
      slug: 'air-fryers',
      description: 'Find the right air fryer for your kitchen. Carefully selected for everyday cooking.',
      icon: '🍟',
      category: kitchen._id,
      seoTitle: 'Best Air Fryers in India | Nitya Yantra',
      seoDescription: 'Discover selected air fryers with ratings, prices and direct marketplace links.',
      products: [philips._id, pigeon._id, agaro._id],
      isPublished: true
    });
  } else {
    airFryerCol.name = 'Air Fryers';
    airFryerCol.icon = '🍟';
    airFryerCol.category = kitchen._id;
    airFryerCol.description = 'Find the right air fryer for your kitchen. Carefully selected for everyday cooking.';
    airFryerCol.products = [philips._id, pigeon._id, agaro._id];
    airFryerCol.isPublished = true;
    await airFryerCol.save();
  }
  console.log('Collection "Air Fryers" ready with 3 products:', airFryerCol.products.length);

  // 6. Create or Update second Collection under Kitchen: Mixers & Grinders / Kitchen Gadgets
  let gadgetsCol = await Collection.findOne({ slug: 'kitchen-gadgets' });
  if (!gadgetsCol) {
    gadgetsCol = await Collection.create({
      name: 'Kitchen Gadgets',
      slug: 'kitchen-gadgets',
      description: 'Smart and useful time-saving gadgets for modern Indian kitchens.',
      icon: '✨',
      category: kitchen._id,
      seoTitle: 'Top Kitchen Gadgets in India | Nitya Yantra',
      seoDescription: 'Useful kitchen gadgets for smart and fast everyday cooking.',
      products: [philips._id, pigeon._id], // Reused products!
      isPublished: true
    });
  } else {
    gadgetsCol.category = kitchen._id;
    gadgetsCol.icon = '✨';
    gadgetsCol.products = [philips._id, pigeon._id];
    await gadgetsCol.save();
  }
  console.log('Collection "Kitchen Gadgets" ready with 2 products:', gadgetsCol.products.length);

  console.log('SUCCESS: Hierarchy data setup completed.');
  process.exit(0);
}

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
