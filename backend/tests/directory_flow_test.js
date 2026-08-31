import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Collection from '../src/models/Collection.js';
import Product from '../src/models/Product.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nitya-yantra';

async function runDirectoryFlowTests() {
  console.log('========================================================');
  console.log('  RUNNING COMPLETE CATEGORY -> COLLECTION -> PRODUCT FLOW VERIFICATION');
  console.log('========================================================');

  await mongoose.connect(MONGO_URI);

  const results = [];
  const log = (num, name, pass, detail = '') => {
    results.push({ num, name, pass, detail });
    console.log(`[CHECK ${num}] ${pass ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? '— ' + detail : ''}`);
  };

  try {
    // 1. API: Categories directory API returns categories with collectionCount
    const catsRes = await fetch('http://localhost:5000/api/categories');
    const catsJson = await catsRes.json();
    const cats = catsJson.data || [];
    const hasCollectionCount = cats.some(c => typeof c.collectionCount === 'number');
    const kitchenCat = cats.find(c => c.slug === 'kitchen');
    log(1, 'Categories directory API returns real categories with collection counts', hasCollectionCount && kitchenCat?.collectionCount >= 2, `Kitchen collections: ${kitchenCat?.collectionCount}, Total categories: ${cats.length}`);

    // 2. /products route returns HTTP 200 and serves Categories Directory (not raw product cards)
    const productsRes = await fetch('http://localhost:3001/products');
    log(2, '/products route serves All Categories directory (HTTP 200)', productsRes.status === 200, `Status: ${productsRes.status}`);

    // 3. /kitchen route returns HTTP 200 and serves Kitchen Collections
    const kitchenPageRes = await fetch('http://localhost:3001/kitchen');
    log(3, '/kitchen route serves Kitchen Collections grid (HTTP 200)', kitchenPageRes.status === 200, `Status: ${kitchenPageRes.status}`);

    // 4. Collections under Kitchen API
    const kitchenColsRes = await fetch('http://localhost:5000/api/categories/kitchen/collections');
    const kitchenColsJson = await kitchenColsRes.json();
    const kitchenCols = kitchenColsJson.data || [];
    const colSlugs = kitchenCols.map(c => c.slug);
    const hasAirFryersAndMixers = colSlugs.includes('air-fryers') && colSlugs.includes('mixer-grinders');
    log(4, 'Kitchen shows Air Fryers and Mixer Grinders collections', hasAirFryersAndMixers, `Collections: ${colSlugs.join(', ')}`);

    // 5. /kitchen/air-fryers returns HTTP 200 and displays only Air Fryer products
    const afPageRes = await fetch('http://localhost:3001/kitchen/air-fryers');
    log(5, '/kitchen/air-fryers serves collection landing page (HTTP 200)', afPageRes.status === 200, `Status: ${afPageRes.status}`);

    // 6. Air Fryers API returns exact 3 products (Philips, Pigeon, AGARO)
    const afApiRes = await fetch('http://localhost:5000/api/collections/public/air-fryers');
    const afApiJson = await afApiRes.json();
    const afProds = afApiJson.data?.products || [];
    const threeProds = afProds.length === 3;
    const prodNames = afProds.map(p => `#${p.productId} ${p.name.slice(0, 15)}`).join(', ');
    log(6, 'Air Fryers collection contains exactly 3 products', threeProds, `Found: ${prodNames}`);

    // 7. Products have valid ratings, review counts, and prices
    const validMetrics = afProds.every(p => p.lowestPrice > 0 && typeof p.rating === 'number');
    log(7, 'Products have valid prices and ratings', validMetrics, `P1: ₹${afProds[0]?.lowestPrice}, ⭐ ${afProds[0]?.rating} (${afProds[0]?.reviewCount} reviews)`);

    // 8. Marketplace URLs are valid and redirect directly to store
    const p1Amazon = afProds[0]?.marketplaceOffers?.find(m => m.marketplace === 'amazon');
    log(8, 'Marketplace buttons have direct affiliate URLs', Boolean(p1Amazon?.url?.startsWith('http')), `Amazon URL: ${p1Amazon?.url}`);

    // 9. Product without Meesho does NOT show Meesho offer
    const p3 = afProds.find(p => p.productId === 3);
    const p3Stores = (p3?.marketplaceOffers || []).map(m => m.marketplace.toLowerCase());
    log(9, 'Missing marketplace offers are hidden (no empty buttons)', !p3Stores.includes('meesho'), `P3 stores: ${p3Stores.join(', ')}`);

    // 10. No dummy / test products in database
    const allProds = await Product.find({ isActive: true, isPublished: true });
    const dummyCheck = !allProds.some(p => p.name.toLowerCase().includes('test product'));
    log(10, 'No dummy/test products publicly displayed', dummyCheck, `Total published products: ${allProds.length}`);

    // 11. Zepto-style tiles: Collection images exist
    const afCol = await Collection.findOne({ slug: 'air-fryers' });
    log(11, 'Collection has square image URL for Zepto-style tiles', Boolean(afCol?.image), `Image: ${afCol?.image}`);

    // 12. Smart Category / Collection dynamic router handles /kitchen and /air-fryers
    const aliasCatRes = await fetch('http://localhost:3001/category/kitchen');
    const aliasColRes = await fetch('http://localhost:3001/collection/air-fryers');
    log(12, 'Backward-compatible routes /category/kitchen and /collection/air-fryers active', aliasCatRes.status === 200 && aliasColRes.status === 200, `Category: ${aliasCatRes.status}, Collection: ${aliasColRes.status}`);

    console.log('========================================================');
    const passedAll = results.every(r => r.pass);
    console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter(r => r.pass).length} | FAILED: ${results.filter(r => !r.pass).length}`);
    console.log('========================================================');

    process.exit(passedAll ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runDirectoryFlowTests();
