import api from './api';

export const orderService = {
  /**
   * Get all orders for authenticated customer
   */
  async getCustomerOrders() {
    const response = await api.get('/customer/orders');
    return response.data;
  },

  /**
   * Get specific order details
   */
  async getCustomerOrderById(id) {
    const response = await api.get(`/customer/orders/${id}`);
    return response.data;
  },

  /**
   * Get delivery tracking details for an order
   */
  async getCustomerOrderDelivery(id) {
    const response = await api.get(`/customer/orders/${id}/delivery`);
    return response.data;
  },

  /**
   * Place an order from cart
   */
  async placeOrder(orderData) {
    const response = await api.post('/customer/orders', orderData);
    return response.data;
  },

  /**
   * Cancel an order before shipment
   */
  async cancelOrder(id) {
    const response = await api.post(`/customer/orders/${id}/cancel`);
    return response.data;
  }
};

export default orderService;
