import api from './api';

export const farmerOrderService = {
  /**
   * Get all orders containing products listed by the logged-in farmer
   */
  async getFarmerOrders() {
    const response = await api.get('/farmer/orders');
    return response.data;
  },

  /**
   * Update order status (PROCESSING, OUT_FOR_DELIVERY, DELIVERED)
   */
  async updateOrderStatus(orderId, status) {
    const response = await api.put(`/farmer/orders/${orderId}/status`, { status });
    return response.data;
  }
};

export default farmerOrderService;
