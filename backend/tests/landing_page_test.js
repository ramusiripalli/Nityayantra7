import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Collection from '../src/models/Collection.js';
import Product from '../src/models/Product.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nitya-yantra';

async function runLandingPageTests() {
  console.log('========================================================');
  console.log('  RUNNING NITYA YANTRA LANDING PAGE IMPROVEMENTS VERIFICATION');
  console.log('========================================================');

  await mongoose.connect(MONGO_URI);

  const results = [];
  const log = (num, name, pass, detail = '') => {
    results.push({ num, name, pass, detail });
    console.log(`[TEST ${num}] ${pass ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? '— ' + detail : ''}`);
  };

  try {
    // 1. Homepage returns HTTP 200
    const homeRes = await fetch('http://localhost:3001');
    log(1, 'Homepage returns HTTP 200', homeRes.status === 200, `Status: ${homeRes.status}`);

    // 2. Categories API returns published categories
    const catsRes = await fetch('http://localhost:5000/api/categories');
    const catsJson = await catsRes.json();
    const cats = catsJson.data || [];
    log(2, 'Categories API returns real categories from MongoDB', cats.length > 0, `Total categories: ${cats.length}`);

    // 3. Featured Collections API returns only isFeatured: true collections
    const featColsRes = await fetch('http://localhost:5000/api/collections/public?featured=true');
    const featColsJson = await featColsRes.json();
    const featCols = featColsJson.data || [];
    const airFryersFeat = featCols.find(c => c.slug === 'air-fryers');
    const mixerGrindersFeat = featCols.find(c => c.slug === 'mixer-grinders');
    log(3, 'Popular Collections API filters strictly by isFeatured=true', Boolean(airFryersFeat && !mixerGrindersFeat), `Air Fryers included: ${Boolean(airFryersFeat)}, Mixer Grinders included: ${Boolean(mixerGrindersFeat)}`);

    // 4. Unfeatured collections (Mixer Grinders) are accessible under their category
    const kitchenColsRes = await fetch('http://localhost:5000/api/categories/kitchen/collections');
    const kitchenColsJson = await kitchenColsRes.json();
    const kitchenCols = kitchenColsJson.data || [];
    const hasMixer = kitchenCols.some(c => c.slug === 'mixer-grinders');
    log(4, 'Unfeatured collections remain accessible under category (/kitchen)', hasMixer, `Kitchen collections count: ${kitchenCols.length}`);

    // 5. Featured Products API
    const prodsRes = await fetch('http://localhost:5000/api/products');
    const prodsJson = await prodsRes.json();
    const allProds = prodsJson.data?.products || [];
    const featProds = allProds.filter(p => p.isFeatured);
    log(5, 'Featured products exist in catalog for Trending Products section', featProds.length >= 1, `Featured products: ${featProds.length}`);

    // 6. Trending Deals API
    const trendProds = allProds.filter(p => p.isTrending);
    log(6, 'Trending products exist for Trending Deals section', trendProds.length >= 1, `Trending products: ${trendProds.length}`);

    // 7. Direct marketplace URLs on products are valid external links
    const p1 = allProds[0];
    const amazonOffer = p1?.marketplaceOffers?.find(m => m.marketplace === 'amazon');
    log(7, 'Marketplace store offers have direct external URLs', Boolean(amazonOffer?.url?.startsWith('http')), `Amazon offer URL: ${amazonOffer?.url}`);

    // 8. No dummy or test products publicly displayed
    const testProdCheck = !allProds.some(p => p.name.toLowerCase().includes('test product'));
    log(8, 'No dummy/test products in public API responses', testProdCheck, `Total published products: ${allProds.length}`);

    // 9. All Categories Directory route /products returns HTTP 200
    const directoryRes = await fetch('http://localhost:3001/products');
    log(9, 'All Categories directory (/products) returns HTTP 200', directoryRes.status === 200, `Status: ${directoryRes.status}`);

    // 10. Collection product page /kitchen/air-fryers returns HTTP 200
    const afPageRes = await fetch('http://localhost:3001/kitchen/air-fryers');
    log(10, 'Collection page (/kitchen/air-fryers) returns HTTP 200', afPageRes.status === 200, `Status: ${afPageRes.status}`);

    console.log('========================================================');
    const passedAll = results.every(r => r.pass);
    console.log(`TOTAL TESTS: ${results.length} | PASSED: ${results.filter(r => r.pass).length} | FAILED: ${results.filter(r => !r.pass).length}`);
    console.log('========================================================');

    process.exit(passedAll ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runLandingPageTests();
