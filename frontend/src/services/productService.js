import api from './api';

/**
 * Filter helper to isolate development/test products from the public website
 */
const isTestProduct = (prod) => {
  const name = (prod.name || '').toLowerCase();
  const slug = (prod.slug || '').toLowerCase();
  const catName = (typeof prod.category === 'object' ? prod.category?.name : prod.category || '').toLowerCase();
  const catSlug = (typeof prod.category === 'object' ? prod.category?.slug : '').toLowerCase();

  return (
    name.startsWith('test') ||
    name === 'ramu' ||
    slug.startsWith('test-') ||
    slug === 'ramu' ||
    catName.startsWith('test') ||
    catSlug.startsWith('test') ||
    name.includes('sample product') ||
    name.includes('demo product')
  );
};

export const productService = {
  /**
   * Get all products from MongoDB, isolating any development/test records from public display
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      let list = [];
      if (response && response.data && Array.isArray(response.data.products)) {
        list = response.data.products;
      } else if (response && Array.isArray(response.data)) {
        list = response.data;
      }
      return list.filter((p) => !isTestProduct(p));
    } catch (err) {
      console.error('Failed to fetch products from backend API:', err.message);
      return [];
    }
  },

  /**
   * Autocomplete suggestions helper from real products
   */
  async autocompleteProducts(query = '') {
    if (!query.trim()) {
      return { textSuggestions: [], productPreviews: [] };
    }

    try {
      const response = await api.get('/products', { params: { search: query.trim() } });
      const products = (response?.data?.products || response?.data || []).filter((p) => !isTestProduct(p));
      const matching = products.slice(0, 4);

      const textSuggestions = [];
      matching.forEach((p) => {
        const title = p.name || p.title;
        if (title) textSuggestions.push(title);
      });

      return {
        textSuggestions: [...new Set(textSuggestions)].slice(0, 4),
        productPreviews: matching,
      };
    } catch (err) {
      return { textSuggestions: [], productPreviews: [] };
    }
  },

  /**
   * Get product by ID or Slug from MongoDB
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`);
      if (response && response.data) {
        return response.data;
      }
      throw new Error('Product not found');
    } catch (err) {
      throw new Error(err.message || 'Product not found');
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts() {
    try {
      const response = await api.get('/products', { params: { featured: 'true' } });
      const list = response?.data?.products || response?.data || [];
      return list.filter((p) => !isTestProduct(p));
    } catch (err) {
      return [];
    }
  },

  /**
   * Get trending deals
   */
  async getTrendingDeals() {
    try {
      const response = await api.get('/products', { params: { trending: 'true' } });
      const list = response?.data?.products || response?.data || [];
      return list.filter((p) => !isTestProduct(p));
    } catch (err) {
      return [];
    }
  }
};

export default productService;
