import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
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
  validate: (code, items) => 
    api.post('/promotions/validate', { code, items }),
};

export default api;
