import api from './api';

export const farmerService = {
  // Category retrieval
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  // Farmer profile
  async getProfile() {
    const response = await api.get('/farmer/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/farmer/profile', profileData);
    return response.data;
  },

  // Farmer dashboard statistics
  async getStats() {
    const response = await api.get('/farmer/stats');
    return response.data;
  },

  // Product management
  async getProducts() {
    const response = await api.get('/farmer/products');
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/farmer/products/${id}`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post('/farmer/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/farmer/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/farmer/products/${id}`);
    return response.data;
  },

  // Inventory management
  async getInventory(id) {
    const response = await api.get(`/farmer/products/${id}/inventory`);
    return response.data;
  },

  async updateInventory(id, inventoryData) {
    const response = await api.put(`/farmer/products/${id}/inventory`, inventoryData);
    return response.data;
  },
};

export default farmerService;
