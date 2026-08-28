import { MOCK_PRODUCTS } from '../data/mockProducts';

/**
 * Service abstraction for product API calls.
 * Uses local mock data with Promises to prepare for future Express/MongoDB backend integration.
 */
export const productService = {
  /**
   * Get all products with optional filtering & sorting
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
