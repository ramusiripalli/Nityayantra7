import { CATEGORIES } from '../data/categories';
import api from './api';

export const categoryService = {
  async getCategories() {
    try {
      const response = await api.get('/categories?isActive=true');
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (err) {
      // Fallback if backend offline
    }
    return new Promise((resolve) => {
      resolve(CATEGORIES);
    });
  },
};
