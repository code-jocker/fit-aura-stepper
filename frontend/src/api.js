import axios from 'axios';

// Get the base API URL - check multiple sources for flexibility
const getApiUrl = () => {
  // In production, use relative /api path (served by reverse proxy)
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // In development, check for custom API URL first, then fallback to localhost
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Also check for any other env variables that might be set
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  // Default to localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000, // Increased timeout for slower connections
  withCredentials: false // Allow credentials
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors with detailed logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server. API URL:', API_URL);
      console.error('This might be a CORS issue or server is not running');
      
      // Try to provide helpful message based on error code
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out - the server took too long to respond');
      } else if (error.code === 'ERR_NETWORK') {
        console.error('Network error - check if the server is running');
      }
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
};

export const productService = {
  getAll: (params) => 
    api.get('/products', { params }),
  getById: (id) => 
    api.get(`/products/${id}`),
  getCategories: () => 
    api.get('/products/categories'),
};

export const userService = {
  getProfile: () => 
    api.get('/user/profile'),
  getCart: () => 
    api.get('/user/cart'),
  addToCart: (item) => 
    api.post('/user/cart', item),
  removeFromCart: (itemId) => 
    api.delete(`/user/cart/${itemId}`),
};

export const orderService = {
  create: (orderData) => 
    api.post('/orders', orderData),
  getAll: () => 
    api.get('/orders'),
  getById: (id) => 
    api.get(`/orders/${id}`),
};

export const paymentService = {
  initiateMomo: (data) => 
    api.post('/payments/momo', data),
  initiateAirtel: (data) => 
    api.post('/payments/airtel', data),
  initiateFlutterwave: (data) =>
    api.post('/payments/flutterwave/initialize', data),
  verifyFlutterwave: (params) =>
    api.get('/payments/flutterwave/verify', { params }),
};

export const subscriptionService = {
  subscribe: (email) => 
    api.post('/subscribe', { email }),
};

export const testimonialService = {
  getAll: () => 
    api.get('/testimonials'),
};

export const promotionService = {
  getAll: (params) => api.get('/promotions', { params }),
  validate: (code, items) => 
    api.post('/promotions/validate', { code, items }),
};

export default api;
