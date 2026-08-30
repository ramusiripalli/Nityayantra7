import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Collection from '../src/models/Collection.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nitya-yantra';

async function runHierarchyTests() {
  console.log('========================================================');
  console.log('  RUNNING FULL USER-REQUESTED HIERARCHY VERIFICATION');
  console.log('========================================================');

  await mongoose.connect(MONGO_URI);

  const results = [];
  const log = (num, name, pass, detail = '') => {
    results.push({ num, name, pass, detail });
    console.log(`[#${num}] ${pass ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? '— ' + detail : ''}`);
  };

  try {
    // 1. Create/Verify Air Fryers collection
    const airFryerCol = await Collection.findOne({ slug: 'air-fryers' }).populate('category');
    log(1, 'Air Fryers collection exists', Boolean(airFryerCol), `Slug: ${airFryerCol?.slug}, Category: ${airFryerCol?.category?.name}`);

    // 2. Add at least 3 existing products
    const prodsCount = airFryerCol?.products?.length || 0;
    log(2, 'At least 3 products in collection', prodsCount >= 3, `Found ${prodsCount} products`);

    // 3. Verify product ordering (Philips -> Pigeon -> AGARO)
    const publicRes = await fetch('http://localhost:5000/api/collections/public/air-fryers');
    const publicData = await publicRes.json();
    const prods = publicData.data?.products || [];
    const orderMatches = 
      prods[0]?.productId === 1 && 
      prods[1]?.productId === 2 && 
      prods[2]?.productId === 3;
    log(3, 'Product ordering preserved in public API', orderMatches, `Order: #${prods[0]?.productId} (${prods[0]?.name?.slice(0, 15)}), #${prods[1]?.productId} (${prods[1]?.name?.slice(0, 15)}), #${prods[2]?.productId} (${prods[2]?.name?.slice(0, 15)})`);

    // 4. Verify only published products appear
    const allPublished = prods.every(p => p.isPublished === true);
    log(4, 'Only published products appear', allPublished, `All ${prods.length} products have isPublished: true`);

    // 5. Verify unpublished products are hidden
    // Temporarily unpublish product 3
    const p3 = await Product.findOne({ productId: 3 });
    p3.isPublished = false;
    await p3.save();

    const unpubRes = await fetch('http://localhost:5000/api/collections/public/air-fryers');
    const unpubData = await unpubRes.json();
    const unpubList = unpubData.data?.products || [];
    const p3Hidden = !unpubList.some(p => p.productId === 3);
    log(5, 'Unpublished products are automatically hidden', p3Hidden, `Count with P3 unpublished: ${unpubList.length}`);

    // Restore P3 to published
    p3.isPublished = true;
    await p3.save();

    // 6. Verify missing marketplace links are hidden
    // Product 1 has Amazon, Flipkart, Meesho. It does NOT have Myntra.
    const p1 = prods[0];
    const p1Marketplaces = (p1.marketplaceOffers || []).map(m => m.marketplace.toLowerCase());
    const hasMyntra = p1Marketplaces.includes('myntra');
    log(6, 'Missing marketplace links are hidden (no empty boxes)', !hasMyntra && p1Marketplaces.length === 3, `Available: ${p1Marketplaces.join(', ')}`);

    // 7. Verify marketplace buttons open stored URL
    const amazonOffer = p1.marketplaceOffers?.find(m => m.marketplace === 'amazon');
    const hasValidUrl = Boolean(amazonOffer?.url && amazonOffer.url.startsWith('http'));
    log(7, 'Marketplace buttons have valid direct affiliate URLs', hasValidUrl, `Amazon URL: ${amazonOffer?.url}`);

    // 8. Verify rating and review count
    const hasRatingData = prods.every(p => typeof p.rating === 'number' && typeof p.reviewCount === 'number');
    log(8, 'Ratings and review counts are present', hasRatingData, `P1: ⭐ ${p1.rating} (${p1.reviewCount} reviews)`);

    // 9. Verify product numbers
    const validProductIds = prods.every(p => typeof p.productId === 'number' && p.productId > 0);
    log(9, 'Numeric Product ID sequence is valid', validProductIds, `IDs: ${prods.map(p => '#' + p.productId).join(', ')}`);

    // 10. Search "1"
    const s1Res = await fetch('http://localhost:5000/api/products?search=1');
    const s1Json = await s1Res.json();
    const s1Prods = s1Json.data?.products || [];
    const search1Exact = s1Prods.length === 1 && s1Prods[0].productId === 1;
    log(10, 'Search "1" returns exact Product #1', search1Exact, `Found: #${s1Prods[0]?.productId} - ${s1Prods[0]?.name?.slice(0, 30)}`);

    // 11. Search "air fryer"
    const safRes = await fetch('http://localhost:5000/api/products?search=air%20fryer');
    const safJson = await safRes.json();
    const safProds = safJson.data?.products || [];
    log(11, 'Search "air fryer" returns matching collection products', safProds.length >= 3, `Found ${safProds.length} matching products`);

    // 12. Homepage Public Collections by Category API
    const homeColsRes = await fetch('http://localhost:5000/api/collections/public');
    const homeColsJson = await homeColsRes.json();
    const homeCols = homeColsJson.data || [];
    const hasKitchenCollections = homeCols.some(c => c.category?.name === 'Kitchen');
    log(12, 'Homepage groups collections by Category (e.g. Kitchen)', hasKitchenCollections, `Found ${homeCols.length} public collections: ${homeCols.map(c => c.name).join(', ')}`);

    // 13. Direct Collection route /air-fryers
    const directRes = await fetch('http://localhost:3001/air-fryers');
    log(13, 'Direct collection route /air-fryers returns HTTP 200', directRes.status === 200, `Status: ${directRes.status}`);

    // 14. Alias route /collection/air-fryers
    const aliasRes = await fetch('http://localhost:3001/collection/air-fryers');
    log(14, 'Alias route /collection/air-fryers returns HTTP 200', aliasRes.status === 200, `Status: ${aliasRes.status}`);

    // 15. Homepage / route
    const homeRes = await fetch('http://localhost:3001/');
    log(15, 'Homepage / returns HTTP 200', homeRes.status === 200, `Status: ${homeRes.status}`);

    console.log('========================================================');
    const passedAll = results.every(r => r.pass);
    console.log(`TOTAL: ${results.length} | PASSED: ${results.filter(r => r.pass).length} | FAILED: ${results.filter(r => !r.pass).length}`);
    console.log('========================================================');

    process.exit(passedAll ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runHierarchyTests();
