import api from './api';

export const productService = {
  /**
   * Fetch active public products with search, filtering, sorting, and pagination
   * @param {Object} params - { keyword, categoryId, minPrice, maxPrice, sort, page, size }
   */
  async getPublicProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Fetch single public product details by ID
   * @param {string} id - Product UUID
   */
  async getPublicProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Fetch public categories for filters
   */
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }
};

export default productService;
