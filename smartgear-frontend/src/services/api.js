import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// api config - found this online
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // skip ngrok browser warning
  },
  timeout: 10000, // 10 seconds timeout
});

// request interceptor for debugging and auth
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    
    // add auth token to requests
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// api functions
export const getProducts = async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const initializePayment = async (paymentData) => {
  try {
    const response = await api.post('/api/payments/initialize', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await api.get(`/api/payments/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// auth api functions
export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.put('/api/auth/me', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.put('/api/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/api/auth/refresh-token', { refreshToken });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// cart api functions
export const getCart = async () => {
  try {
    const response = await api.get('/api/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/api/cart/items', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.put(`/api/cart/items/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/api/cart/items/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/api/cart');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

export const cleanupCart = async () => {
  try {
    const response = await api.post('/api/cart/cleanup');
    return response.data;
  } catch (error) {
    console.error('Error cleaning up cart:', error);
    throw error;
  }
};

export const getCartCount = async () => {
  try {
    const response = await api.get('/api/cart/count');
    return response.data;
  } catch (error) {
    console.error('Error getting cart count:', error);
    throw error;
  }
};

// order endpoints
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

export const getUserOrders = async (params = {}) => {
  try {
    const response = await api.get('/api/orders', { params });
    return response.data;
  } catch (error) {
    console.error('Get user orders error:', error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Get order error:', error);
    throw error;
  }
};

export const getUserOrderStats = async () => {
  try {
    const response = await api.get('/api/orders/stats');
    return response.data;
  } catch (error) {
    console.error('Get user order stats error:', error);
    throw error;
  }
};

export default api;