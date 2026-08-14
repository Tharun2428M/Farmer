import api from './api';

export const wishlistService = {
  /**
   * Fetch authenticated customer's wishlist
   */
  async getWishlist() {
    const response = await api.get('/customer/wishlist');
    return response.data;
  },

  /**
   * Add product to wishlist
   * @param {string} productId
   */
  async addToWishlist(productId) {
    const response = await api.post(`/customer/wishlist/${productId}`);
    return response.data;
  },

  /**
   * Remove product from wishlist
   * @param {string} productId
   */
  async removeFromWishlist(productId) {
    const response = await api.delete(`/customer/wishlist/${productId}`);
    return response.data;
  }
};

export default wishlistService;
