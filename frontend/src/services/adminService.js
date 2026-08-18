import api from './api';

export const adminService = {
  // Dashboard Overview
  getDashboardStats: async () => {
    return await api.get('/admin/dashboard');
  },

  // Users Management
  getUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  getUserById: async (id) => {
    return await api.get(`/admin/users/${id}`);
  },

  updateUserStatus: async (id, status) => {
    return await api.put(`/admin/users/${id}/status`, { status });
  },

  // Farmers Management
  getFarmers: async (params = {}) => {
    return await api.get('/admin/farmers', { params });
  },

  getFarmerById: async (id) => {
    return await api.get(`/admin/farmers/${id}`);
  },

  getFarmerProducts: async (id) => {
    return await api.get(`/admin/farmers/${id}/products`);
  },

  getFarmerOrders: async (id) => {
    return await api.get(`/admin/farmers/${id}/orders`);
  },

  updateFarmerStatus: async (id, status) => {
    return await api.put(`/admin/farmers/${id}/status`, { status });
  },

  // Products Management
  getProducts: async (params = {}) => {
    return await api.get('/admin/products', { params });
  },

  getLowStockProducts: async () => {
    return await api.get('/admin/products/low-stock');
  },

  getProductById: async (id) => {
    return await api.get(`/admin/products/${id}`);
  },

  setProductStatus: async (id, isActive) => {
    return await api.put(`/admin/products/${id}/status`, null, { params: { isActive } });
  },

  deleteProduct: async (id) => {
    return await api.delete(`/admin/products/${id}`);
  },

  // Categories Management
  getCategories: async () => {
    return await api.get('/admin/categories');
  },

  getCategoryById: async (id) => {
    return await api.get(`/admin/categories/${id}`);
  },

  createCategory: async (data) => {
    return await api.post('/admin/categories', data);
  },

  updateCategory: async (id, data) => {
    return await api.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id) => {
    return await api.delete(`/admin/categories/${id}`);
  },

  // Orders Management
  getOrders: async (params = {}) => {
    return await api.get('/admin/orders', { params });
  },

  getOrderById: async (id) => {
    return await api.get(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (id, status) => {
    return await api.put(`/admin/orders/${id}/status`, { status });
  },

  // Payments Management
  getPayments: async (params = {}) => {
    return await api.get('/admin/payments', { params });
  },

  getPaymentById: async (id) => {
    return await api.get(`/admin/payments/${id}`);
  },

  // Deliveries Management
  getDeliveries: async (params = {}) => {
    return await api.get('/admin/deliveries', { params });
  },

  updateDelivery: async (id, data) => {
    return await api.put(`/admin/deliveries/${id}`, data);
  },

  // Reviews Management
  getReviews: async (params = {}) => {
    return await api.get('/admin/reviews', { params });
  },

  deleteReview: async (id) => {
    return await api.delete(`/admin/reviews/${id}`);
  },

  // Analytics Overview
  getAnalyticsOverview: async (params = {}) => {
    return await api.get('/admin/analytics/overview', { params });
  },

  // CSV Report Exports (Handles direct file download trigger)
  exportCsvReport: async (type) => {
    const token = localStorage.getItem('jwt_token');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const response = await fetch(`${API_BASE_URL}/admin/reports/export/${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download ${type} CSV report`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmers_market_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // System Diagnostics
  getSystemHealth: async () => {
    return await api.get('/admin/system/health');
  }
};

export default adminService;
