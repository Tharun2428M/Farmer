import axios from 'axios';

// Central API configuration using Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000
});

// Request Interceptor: Automatically attach Bearer JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error formatting & auth expiration handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If response is 401 and token exists, clear expired auth credentials
    if (error.response?.status === 401) {
      const existingToken = localStorage.getItem('jwt_token');
      if (existingToken && !error.config?.url?.includes('/auth/login')) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        window.dispatchEvent(new Event('auth-session-expired'));
      }
    }

    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.code === 'ERR_NETWORK' ? 'Unable to connect to backend server. Please verify Spring Boot is running on port 8080.' : error.message) ||
        'An unexpected network error occurred',
      status: error.response?.status || 500,
      statusText: error.response?.data?.status || 'ERROR',
      data: error.response?.data?.data || null,
      rawError: error
    };

    return Promise.reject(customError);
  }
);

export const checkHealth = async () => {
  return await api.get('/health');
};

export default api;
