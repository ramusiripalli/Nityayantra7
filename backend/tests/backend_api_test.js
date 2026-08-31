import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

async function runBackendApiTests() {
  console.log('========================================================');
  console.log('  RUNNING NITYA YANTRA BACKEND REST API VERIFICATION');
  console.log('========================================================');

  const results = [];
  const log = (num, name, pass, detail = '') => {
    results.push({ num, name, pass, detail });
    console.log(`[TEST ${num}] ${pass ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? '— ' + detail : ''}`);
  };

  try {
    // 1. GET /api/health
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    const isDbConnected = healthJson.database && healthJson.database.status === 'connected';
    log(
      1,
      'GET /api/health reports backend is healthy and MongoDB is connected',
      healthRes.status === 200 && isDbConnected,
      `Status: ${healthJson.status}, DB: ${healthJson.database?.status}, Host: ${healthJson.database?.host}/${healthJson.database?.name}`
    );

    // 2. GET /api/categories
    const catsRes = await fetch(`${BASE_URL}/categories`);
    const catsJson = await catsRes.json();
    const categories = catsJson.data || [];
    log(
      2,
      'GET /api/categories returns active categories with collectionCount',
      catsRes.status === 200 && categories.length > 0 && categories[0].collectionCount !== undefined,
      `Total categories: ${categories.length}, Sample: ${categories[0]?.name} (${categories[0]?.collectionCount} collections)`
    );

    // 3. GET /api/categories/:slug
    const catSlugRes = await fetch(`${BASE_URL}/categories/kitchen`);
    const catSlugJson = await catSlugRes.json();
    const kitchenCat = catSlugJson.data;
    log(
      3,
      'GET /api/categories/kitchen returns Kitchen category with collections attached',
      catSlugRes.status === 200 && kitchenCat?.slug === 'kitchen' && Array.isArray(kitchenCat?.collections),
      `Name: ${kitchenCat?.name}, Collections attached: ${kitchenCat?.collections?.length}`
    );

    // 4. GET /api/collections
    const colsRes = await fetch(`${BASE_URL}/collections`);
    const colsJson = await colsRes.json();
    const collections = colsJson.data || [];
    log(
      4,
      'GET /api/collections returns published collections',
      colsRes.status === 200 && collections.length > 0,
      `Total collections: ${collections.length}, First: ${collections[0]?.name}`
    );

    // 5. GET /api/collections/:slug
    const colSlugRes = await fetch(`${BASE_URL}/collections/air-fryers`);
    const colSlugJson = await colSlugRes.json();
    const airFryersCol = colSlugJson.data;
    log(
      5,
      'GET /api/collections/air-fryers returns Air Fryers collection with populated products',
      colSlugRes.status === 200 && airFryersCol?.slug === 'air-fryers' && Array.isArray(airFryersCol?.products),
      `Collection: ${airFryersCol?.name}, Products: ${airFryersCol?.products?.length}`
    );

    // 6. GET /api/products
    const prodsRes = await fetch(`${BASE_URL}/products`);
    const prodsJson = await prodsRes.json();
    const products = prodsJson.data?.products || [];
    const pagination = prodsJson.data?.pagination;
    log(
      6,
      'GET /api/products returns paginated product catalog',
      prodsRes.status === 200 && products.length > 0 && pagination !== undefined,
      `Page count: ${products.length}, Total in DB: ${pagination?.total}`
    );

    // 7. GET /api/products/:productNumber (numeric lookup)
    const prodNumRes = await fetch(`${BASE_URL}/products/1`);
    const prodNumJson = await prodNumRes.json();
    const prod1 = prodNumJson.data;
    log(
      7,
      'GET /api/products/1 returns single product by numeric productId',
      prodNumRes.status === 200 && prod1?.productId === 1,
      `Product #1: ${prod1?.name?.substring(0, 35)}... (Lowest: ₹${prod1?.lowestPrice})`
    );

    // 8. GET /api/products/search?q=...
    const searchRes = await fetch(`${BASE_URL}/products/search?q=air`);
    const searchJson = await searchRes.json();
    const searchMatches = searchJson.data || [];
    log(
      8,
      'GET /api/products/search?q=air returns matching products',
      searchRes.status === 200 && searchMatches.length > 0,
      `Found ${searchMatches.length} matching products for 'air'`
    );

    // 9. GET /api/marketplaces
    const mktsRes = await fetch(`${BASE_URL}/marketplaces`);
    const mktsJson = await mktsRes.json();
    const marketplaces = mktsJson.data || [];
    log(
      9,
      'GET /api/marketplaces returns supported marketplaces and styling metadata',
      mktsRes.status === 200 && marketplaces.length >= 4,
      `Supported: ${marketplaces.map((m) => m.name).join(', ')}`
    );

    // 10. Direct marketplace affiliate URLs verified on Product #1
    const p1Offers = prod1?.marketplaceOffers || [];
    const amazonOffer = p1Offers.find((o) => o.marketplace === 'amazon');
    log(
      10,
      'Product marketplace offers contain direct store URLs and no empty buttons',
      amazonOffer && Boolean(amazonOffer.url || amazonOffer.productUrl),
      `Amazon URL: ${amazonOffer?.url || amazonOffer?.productUrl}, Price: ₹${amazonOffer?.price}`
    );

  } catch (err) {
    console.error('Test execution error:', err);
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log('========================================================');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runBackendApiTests();
