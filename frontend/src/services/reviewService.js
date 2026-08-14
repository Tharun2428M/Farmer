import api from './api';

export const reviewService = {
  /**
   * Get public reviews for a product
   */
  async getProductReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  /**
   * Submit a verified purchase review
   */
  async createReview(productId, reviewData) {
    const response = await api.post(`/customer/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  /**
   * Update existing review
   */
  async updateReview(reviewId, reviewData) {
    const response = await api.put(`/customer/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  /**
   * Delete review
   */
  async deleteReview(reviewId) {
    const response = await api.delete(`/customer/reviews/${reviewId}`);
    return response.data;
  }
};

export default reviewService;
