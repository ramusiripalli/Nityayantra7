import api from './api';

export const authService = {
  /**
   * Admin Login API Request
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data?.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }
    return response;
  },

  /**
   * Admin Logout
   */
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  /**
   * Get Cached Admin User Object
   */
  getAdminUser() {
    try {
      const user = localStorage.getItem('adminUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check Authentication Status
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem('adminToken'));
  },
};

export default authService;
