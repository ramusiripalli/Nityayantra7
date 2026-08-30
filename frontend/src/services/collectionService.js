import api from './api';

export const collectionService = {
  /**
   * Public: Fetch published collection by slug with populated products
   */
  async getPublicCollectionBySlug(slug) {
    try {
      const response = await api.get(`/collections/public/${slug}`);
      return response.data || null;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      }
      console.error('Failed to fetch public collection:', err.message);
      throw err;
    }
  },

  /**
   * Public: Fetch all published collections (optionally filter by category)
   */
  async getPublicCollections(params = {}) {
    try {
      const response = await api.get('/collections/public', { params });
      return response.data || [];
    } catch (err) {
      console.error('Failed to fetch public collections:', err.message);
      return [];
    }
  },

  /**
   * Admin: Get all collections
   */
  async getCollections(params = {}) {
    const response = await api.get('/collections', { params });
    return response.data || [];
  },

  /**
   * Admin: Get collection by ID
   */
  async getCollectionById(id) {
    const response = await api.get(`/collections/${id}`);
    return response.data || null;
  },

  /**
   * Admin: Create new collection
   */
  async createCollection(data) {
    const response = await api.post('/collections', data);
    return response.data;
  },

  /**
   * Admin: Update collection
   */
  async updateCollection(id, data) {
    const response = await api.put(`/collections/${id}`, data);
    return response.data;
  },

  /**
   * Admin: Delete collection
   */
  async deleteCollection(id) {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },
};

export default collectionService;
