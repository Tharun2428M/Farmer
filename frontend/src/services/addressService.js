import api from './api';

export const addressService = {
  /**
   * Get customer's saved addresses
   */
  async getAddresses() {
    const response = await api.get('/customer/addresses');
    return response.data;
  },

  /**
   * Get single address by ID
   */
  async getAddressById(id) {
    const response = await api.get(`/customer/addresses/${id}`);
    return response.data;
  },

  /**
   * Create new delivery address
   */
  async createAddress(addressData) {
    const response = await api.post('/customer/addresses', addressData);
    return response.data;
  },

  /**
   * Update existing delivery address
   */
  async updateAddress(id, addressData) {
    const response = await api.put(`/customer/addresses/${id}`, addressData);
    return response.data;
  },

  /**
   * Delete address
   */
  async deleteAddress(id) {
    const response = await api.delete(`/customer/addresses/${id}`);
    return response.data;
  }
};

export default addressService;
