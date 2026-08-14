import api from './api';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

/**
 * Authentication Service connecting to Spring Boot Auth APIs (Phase 4 / Phase 6)
 */
export const authService = {
  /**
   * User login: POST /api/auth/login
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ token: string, tokenType: string, user: Object }>}
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password
    });

    if (response?.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * User registration: POST /api/auth/register
   * @param {Object} userData - { name, email, password, phone, role }
   * @returns {Promise<{ token: string, tokenType: string, user: Object }>}
   */
  async register(userData) {
    // Security check: ADMIN role registration is forbidden
    const roleToRegister = userData.role === 'FARMER' ? 'FARMER' : 'CUSTOMER';

    const payload = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      phone: userData.phone ? userData.phone.trim() : '',
      role: roleToRegister
    };

    const response = await api.post('/auth/register', payload);

    if (response?.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * User logout: clears local storage tokens and state
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Retrieve current stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Retrieve current stored user
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Role RBAC verification test endpoints (Phase 4 Spring Security controllers)
   */
  async testCustomerAccess() {
    return await api.get('/customer/test');
  },

  async testFarmerAccess() {
    return await api.get('/farmer/test');
  },

  async testAdminAccess() {
    return await api.get('/admin/test');
  }
};

export default authService;
