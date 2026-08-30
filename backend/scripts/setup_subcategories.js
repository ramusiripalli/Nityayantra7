import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Collection from '../src/models/Collection.js';
import Product from '../src/models/Product.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nitya-yantra';

async function setupSubcategories() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const kitchen = await Category.findOne({ slug: 'kitchen' });
  if (!kitchen) {
    console.error('Kitchen category not found!');
    process.exit(1);
  }

  // 1. Update Air Fryers collection with image and category
  let airFryers = await Collection.findOne({ slug: 'air-fryers' });
  if (!airFryers) {
    airFryers = await Collection.create({
      name: 'Air Fryers',
      slug: 'air-fryers',
      category: kitchen._id,
      image: 'https://m.media-amazon.com/images/I/51wXUqH7E8L._SX679_.jpg',
      icon: '🍟',
      description: 'Find the right air fryer for everyday healthy cooking.',
      isPublished: true,
    });
  } else {
    airFryers.image = 'https://m.media-amazon.com/images/I/51wXUqH7E8L._SX679_.jpg';
    airFryers.category = kitchen._id;
    airFryers.icon = '🍟';
    airFryers.isPublished = true;
    await airFryers.save();
  }
  console.log('Air Fryers collection updated:', airFryers.slug);

  // 2. Create or Update Mixer Grinders collection
  let mixerGrinders = await Collection.findOne({ slug: 'mixer-grinders' });
  if (!mixerGrinders) {
    mixerGrinders = await Collection.create({
      name: 'Mixer Grinders',
      slug: 'mixer-grinders',
      category: kitchen._id,
      image: 'https://m.media-amazon.com/images/I/71R2o5fKjEL._SX679_.jpg',
      icon: '⚙️',
      description: 'Heavy duty mixer grinders for versatile Indian cooking.',
      isPublished: true,
      products: [],
    });
  } else {
    mixerGrinders.image = 'https://m.media-amazon.com/images/I/71R2o5fKjEL._SX679_.jpg';
    mixerGrinders.category = kitchen._id;
    mixerGrinders.icon = '⚙️';
    mixerGrinders.isPublished = true;
    await mixerGrinders.save();
  }
  console.log('Mixer Grinders collection updated:', mixerGrinders.slug);

  // 3. Link 3 Air Fryer products to Air Fryers collection
  const airFryerProducts = await Product.find({
    productId: { $in: [1, 2, 3] },
  });

  const pIds = [];
  for (const p of airFryerProducts) {
    p.collectionId = airFryers._id;
    p.category = kitchen._id;
    p.isPublished = true;
    p.isActive = true;
    await p.save();
    pIds.push(p._id);
  }

  airFryers.products = pIds;
  await airFryers.save();
  console.log(`Linked ${pIds.length} products to Air Fryers collection`);

  // 4. Remove / unpublish any dummy test products
  const deleteDummy = await Product.deleteMany({
    name: { $regex: /test/i }
  });
  console.log(`Cleaned up ${deleteDummy.deletedCount} dummy test products`);

  console.log('Subcategories & products setup completed successfully!');
  process.exit(0);
}

setupSubcategories().catch((err) => {
  console.error(err);
  process.exit(1);
});
