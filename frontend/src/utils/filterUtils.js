/**
 * Reusable utility functions for filtering, sorting, parsing and serializing product filters.
 * Works seamlessly with real MongoDB Product and Category documents.
 */

export function parseFilterParams(searchParams) {
  return {
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    pricePreset: searchParams.get('pricePreset') || '',
    minRating: searchParams.get('minRating') || '',
    marketplaces: searchParams.get('marketplaces') ? searchParams.get('marketplaces').split(',') : [],
    minDiscount: searchParams.get('minDiscount') || '',
    hasVideoReview: searchParams.get('videoReview') === 'true',
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: searchParams.get('sort') || 'featured',
  };
}

export function serializeFilterParams(filters) {
  const params = new URLSearchParams();

  if (filters.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.pricePreset) params.set('pricePreset', filters.pricePreset);
  if (filters.minRating) params.set('minRating', filters.minRating);
  if (filters.marketplaces && filters.marketplaces.length > 0) params.set('marketplaces', filters.marketplaces.join(','));
  if (filters.minDiscount) params.set('minDiscount', filters.minDiscount);
  if (filters.hasVideoReview) params.set('videoReview', 'true');
  if (filters.inStockOnly) params.set('inStock', 'true');
  if (filters.sortBy && filters.sortBy !== 'featured') params.set('sort', filters.sortBy);

  return params;
}

export function countActiveFilters(filters) {
  let count = 0;
  if (filters.category && filters.category !== 'all') count++;
  if (filters.pricePreset || filters.minPrice || filters.maxPrice) count++;
  if (filters.minRating) count++;
  if (filters.marketplaces && filters.marketplaces.length > 0) count += filters.marketplaces.length;
  if (filters.minDiscount) count++;
  if (filters.hasVideoReview) count++;
  if (filters.inStockOnly) count++;
  return count;
}

export function getProductPrice(p) {
  if (p.lowestPrice !== undefined && p.lowestPrice !== null && p.lowestPrice > 0) return p.lowestPrice;
  if (p.currentPrice !== undefined && p.currentPrice !== null && p.currentPrice > 0) return p.currentPrice;
  if (p.marketplaceOffers && Array.isArray(p.marketplaceOffers) && p.marketplaceOffers.length > 0 && p.marketplaceOffers[0]?.price > 0) {
    return p.marketplaceOffers[0].price;
  }
  return 0;
}

export function filterProducts(products = [], filters = {}) {
  let result = [...products];

  // 1. Category Filter
  if (filters.category && filters.category !== 'all') {
    const targetCat = filters.category.toLowerCase().trim();
    if (targetCat === 'deals') {
      result = result.filter((p) => (p.discountPercent || 0) > 0 || p.isTrending || p.isBestDeal);
    } else {
      result = result.filter((p) => {
        if (!p.category) return false;
        if (typeof p.category === 'object') {
          const cSlug = (p.category.slug || '').toLowerCase();
          const cName = (p.category.name || '').toLowerCase();
          const cId = String(p.category._id || p.category.id || '').toLowerCase();
          return cSlug === targetCat || cName === targetCat || cId === targetCat;
        }
        const cStr = String(p.category).toLowerCase();
        return cStr === targetCat;
      });
    }
  }

  // 2. Price Range / Presets
  let minP = filters.minPrice ? Number(filters.minPrice) : null;
  let maxP = filters.maxPrice ? Number(filters.maxPrice) : null;

  if (filters.pricePreset === 'under_500') { minP = 0; maxP = 500; }
  else if (filters.pricePreset === '500_1000') { minP = 500; maxP = 1000; }
  else if (filters.pricePreset === '1000_5000') { minP = 1000; maxP = 5000; }
  else if (filters.pricePreset === '5000_10000') { minP = 5000; maxP = 10000; }
  else if (filters.pricePreset === 'above_10000') { minP = 10000; maxP = Infinity; }

  if (minP !== null && !isNaN(minP)) {
    result = result.filter((p) => getProductPrice(p) >= minP);
  }
  if (maxP !== null && !isNaN(maxP)) {
    result = result.filter((p) => getProductPrice(p) <= maxP);
  }

  // 3. Rating Filter
  if (filters.minRating) {
    result = result.filter((p) => (p.rating || 0) >= Number(filters.minRating));
  }

  // 4. Marketplace Filter
  if (filters.marketplaces && filters.marketplaces.length > 0) {
    result = result.filter((p) => {
      const best = (p.lowestMarketplace || p.marketplaceOffers?.[0]?.marketplace || '').toLowerCase();
      const allMarkets = p.marketplaceOffers ? p.marketplaceOffers.map(o => (o.marketplace || '').toLowerCase()) : [best];
      return filters.marketplaces.some((m) => allMarkets.includes(m.toLowerCase()));
    });
  }

  // 5. Discount Filter
  if (filters.minDiscount) {
    result = result.filter((p) => (p.discountPercent || 0) >= Number(filters.minDiscount));
  }

  // 6. Video Review Filter
  if (filters.hasVideoReview) {
    result = result.filter((p) => Boolean(p.videos?.youtubeVideoId || p.youtubeVideoId));
  }

  // 7. In Stock Filter
  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock !== false);
  }

  // 8. Sorting
  if (filters.sortBy) {
    result = sortProducts(result, filters.sortBy);
  }

  return result;
}

export function sortProducts(products = [], sortBy = 'featured') {
  const sorted = [...products];

  if (sortBy === 'price_low') {
    sorted.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  } else if (sortBy === 'price_high') {
    sorted.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  } else if (sortBy === 'rating') {
    sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'discount') {
    sorted.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  } else if (sortBy === 'most_reviewed') {
    sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  } else if (sortBy === 'newest') {
    sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortBy === 'featured') {
    sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return sorted;
}
