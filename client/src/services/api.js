const BASE_URL = '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('smart_canteen_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  // Auth
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiFetch('/auth/me'),
  getDemoAccounts: () => apiFetch('/auth/demo-accounts'),
  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Food
  getFoods: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/foods${query ? `?${query}` : ''}`);
  },
  getFoodById: (id) => apiFetch(`/foods/${id}`),
  createFood: (foodData) => apiFetch('/foods', { method: 'POST', body: JSON.stringify(foodData) }),
  updateFood: (id, updates) => apiFetch(`/foods/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  toggleFoodAvailability: (id) => apiFetch(`/foods/${id}/toggle-availability`, { method: 'PATCH' }),
  deleteFood: (id) => apiFetch(`/foods/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => apiFetch('/orders/my-orders'),
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id) => apiFetch(`/orders/${id}`),
  updateOrderStatus: (id, statusData) =>
    apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),
  verifyOrderQR: (verifyData) =>
    apiFetch('/orders/verify-qr', { method: 'POST', body: JSON.stringify(verifyData) }),
  markOrderCollected: (id, options = {}) =>
    apiFetch(`/orders/${id}/collect`, { method: 'PATCH', body: JSON.stringify(options) }),
  simulateNextStatus: (id) => apiFetch(`/orders/${id}/simulate-next`, { method: 'POST' }),

  // Payment
  simulatePayment: (paymentData) =>
    apiFetch('/payments/simulate', { method: 'POST', body: JSON.stringify(paymentData) }),

  // Analytics
  getAnalytics: () => apiFetch('/analytics/stats'),

  // Notifications
  getNotifications: () => apiFetch('/notifications'),
  markNotificationsRead: () => apiFetch('/notifications/mark-read', { method: 'PATCH' })
};
