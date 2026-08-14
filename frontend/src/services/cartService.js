import api from './api';

export const cartService = {
  /**
   * Fetch authenticated customer's cart
   */
  async getCart() {
    const response = await api.get('/customer/cart');
    return response.data;
  },

  /**
   * Add produce item to cart with quantity
   * @param {Object} data - { productId: string, quantity: number }
   */
  async addToCart(data) {
    const response = await api.post('/customer/cart/items', data);
    return response.data;
  },

  /**
   * Update quantity of a cart line item
   * @param {string} cartItemId
   * @param {number} quantity
   */
  async updateCartItemQuantity(cartItemId, quantity) {
    const response = await api.put(`/customer/cart/items/${cartItemId}`, { quantity });
    return response.data;
  },

  /**
   * Remove single line item from cart
   * @param {string} cartItemId
   */
  async removeCartItem(cartItemId) {
    const response = await api.delete(`/customer/cart/items/${cartItemId}`);
    return response.data;
  },

  /**
   * Clear entire cart
   */
  async clearCart() {
    const response = await api.delete('/customer/cart');
    return response.data;
  }
};

export default cartService;
