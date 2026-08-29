import { MOCK_PRODUCTS } from '../data/mockProducts';

/**
 * Service abstraction for product API calls & search.
 * Uses local mock data with Promises to prepare for future Express/MongoDB backend integration.
 */
export const productService = {
  /**
   * Get all products with multi-faceted filtering & sorting
   */
  async getProducts(params = {}) {
    return new Promise((resolve) => {
      let filtered = [...MOCK_PRODUCTS];

      // Category filtering
      if (params.category && params.category !== 'all') {
        if (params.category === 'deals') {
          filtered = filtered.filter((p) => (p.discountPercent || 0) > 0 || p.isTrending || p.isBestDeal);
        } else {
          filtered = filtered.filter(
            (p) => p.category?.toLowerCase() === params.category?.toLowerCase()
          );
        }
      }

      // Case-insensitive search across title, category, shortDescription, description
      if (params.search) {
        const query = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.title?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query) ||
            p.shortDescription?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        );
      }

      // Min/Max Price Filtering
      if (params.minPrice !== undefined && params.minPrice !== null && params.minPrice !== '') {
        filtered = filtered.filter((p) => p.currentPrice >= Number(params.minPrice));
      }
      if (params.maxPrice !== undefined && params.maxPrice !== null && params.maxPrice !== '') {
        filtered = filtered.filter((p) => p.currentPrice <= Number(params.maxPrice));
      }

      // Rating Filtering
      if (params.minRating) {
        filtered = filtered.filter((p) => (p.rating || 0) >= Number(params.minRating));
      }

      // Marketplace Filtering
      if (params.marketplaces && params.marketplaces.length > 0) {
        const mps = Array.isArray(params.marketplaces) ? params.marketplaces : [params.marketplaces];
        if (mps.length > 0) {
          filtered = filtered.filter((p) => {
            if (!p.lowestMarketplace) return true;
            return mps.some((m) => m.toLowerCase() === p.lowestMarketplace.toLowerCase());
          });
        }
      }

      // Sorting
      if (params.sortBy) {
        if (params.sortBy === 'price_low') {
          filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        } else if (params.sortBy === 'price_high') {
          filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        } else if (params.sortBy === 'rating') {
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (params.sortBy === 'discount') {
          filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        } else if (params.sortBy === 'featured') {
          filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }
      }

      setTimeout(() => resolve(filtered), 50);
    });
  },

  /**
   * Autocomplete suggestions helper
   */
  async autocompleteProducts(query = '') {
    return new Promise((resolve) => {
      if (!query.trim()) {
        resolve({ textSuggestions: [], productPreviews: [] });
        return;
      }

      const q = query.toLowerCase().trim();

      // Matching Products (up to 4)
      const matchingProducts = MOCK_PRODUCTS.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
      ).slice(0, 4);

      // Generate realistic text search suggestions
      const textSuggestions = [];
      
      // Category match
      const matchedCategory = MOCK_PRODUCTS.find((p) => p.category?.toLowerCase().includes(q));
      if (matchedCategory) {
        textSuggestions.push(`${query} in ${matchedCategory.category}`);
      }

      textSuggestions.push(`${query}`);
      textSuggestions.push(`${query} under ₹5000`);
      textSuggestions.push(`best ${query} deals`);

      // Deduplicate
      const uniqueText = [...new Set(textSuggestions)].slice(0, 4);

      setTimeout(() => {
        resolve({
          textSuggestions: uniqueText,
          productPreviews: matchingProducts,
        });
      }, 30);
    });
  },

  /**
   * Get product by ID or Slug
   */
  async getProductById(id) {
    return new Promise((resolve, reject) => {
      const product = MOCK_PRODUCTS.find(
        (p) => String(p.id) === String(id) || p.slug === String(id)
      );
      setTimeout(() => {
        if (product) resolve(product);
        else reject(new Error('Product not found'));
      }, 50);
    });
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts() {
    return new Promise((resolve) => {
      const featured = MOCK_PRODUCTS.filter((p) => p.isFeatured);
      setTimeout(() => resolve(featured), 50);
    });
  },

  /**
   * Get trending deals
   */
  async getTrendingDeals() {
    return new Promise((resolve) => {
      const trending = [...MOCK_PRODUCTS]
        .filter((p) => p.isTrending || (p.discountPercent || 0) > 0)
        .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      setTimeout(() => resolve(trending), 50);
    });
  }
};

export default productService;
