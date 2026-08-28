import { CATEGORIES } from '../data/categories';

export const categoryService = {
  async getCategories() {
    // In production: return api.get('/categories');
    return new Promise((resolve) => {
      setTimeout(() => resolve(CATEGORIES), 50);
    });
  },
};
