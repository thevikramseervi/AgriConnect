import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Farmer APIs
export const farmerAPI = {
  createProduct: (data) => {
    // Check if data is FormData for file uploads
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return api.post('/farmer/product', data, config);
  },
  getMyProducts: () => api.get('/farmer/products'),
  updateProduct: (productId, data) => {
    // Check if data is FormData for file uploads
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return api.put(`/farmer/updateProduct/${productId}`, data, config);
  },
  deleteProduct: (productId) => api.delete(`/farmer/deleteProduct/${productId}`),
  getSalesAnalytics: () => api.get('/farmer/salesAnalytics'),
};

// Vendor APIs
export const vendorAPI = {
  purchaseFromFarmer: (productId, quantity) => api.post(`/vendor/purchase/${productId}`, { quantity }),
  getMyProducts: () => api.get('/vendor/products'),
  getSalesAnalytics: () => api.get('/vendor/salesAnalytics'),
  getExpenditureAnalytics: () => api.get('/vendor/expenditureAnalytics'),
};

// Customer APIs
export const customerAPI = {
  purchaseFromVendor: (data) => api.post('/customer/purchase', data),
  getExpenditureAnalytics: () => api.get('/customer/expenditureAnalytics'),
};

// Product APIs
export const productAPI = {
  getAvailableProducts: () => api.get('/products/available'),
};

// Order APIs
export const orderAPI = {
  getMyOrders: () => api.get('/order/user'),
  getOrderDetails: (orderId) => api.get(`/order/${orderId}`),
  getDashboard: () => api.get('/order/dashboard'),
};

export default api;

