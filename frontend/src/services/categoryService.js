import api from './api';

/**
 * Filter helper to isolate development/test categories from the public website
 */
const isTestCategory = (cat) => {
  const name = (cat.name || '').toLowerCase();
  const slug = (cat.slug || '').toLowerCase();
  return (
    name.startsWith('test') ||
    slug.startsWith('test') ||
    name.includes('test product') ||
    name.includes('test external')
  );
};

export const categoryService = {
  /**
   * Fetch real active categories from MongoDB backend REST API,
   * isolating any development/test records from public display.
   */
  async getCategories() {
    try {
      const response = await api.get('/categories?isActive=true');
      if (response && response.data && Array.isArray(response.data)) {
        return response.data.filter((cat) => !isTestCategory(cat));
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch categories from backend API:', err.message);
      return [];
    }
  },
};

export default categoryService;
