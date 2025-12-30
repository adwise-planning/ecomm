import axios from 'axios';

// Create a new axios instance with a custom configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('ecomEzUser'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized error handler
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};

export const api = {
  login: async (email, otp) => {
    try {
      const response = await apiClient.post('/auth/login', { email, otp });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getDashboardMetrics: async (range) => {
    try {
      const response = await apiClient.get(`/dashboard/metrics?range=${range}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getOrders: async (page = 1, limit = 10, sort = null, filters = {}, searchTerm = '') => {
    try {
      const params = new URLSearchParams({ page, limit, searchTerm });
      if (sort) {
        params.append('sortBy', sort.key);
        params.append('sortDir', sort.dir);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.paymentMode) {
        params.append('paymentMode', filters.paymentMode);
      }
      const response = await apiClient.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getRtoAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/rto');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getRecommendations: async () => {
    try {
      const response = await apiClient.get('/ai/recommendations');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getIntegrations: async () => {
    try {
      const response = await apiClient.get('/integrations');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateIntegration: async (id, data) => {
    try {
      const response = await apiClient.put(`/integrations/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getTeam: async () => {
    try {
      const response = await apiClient.get('/team');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  inviteMember: async (email, name) => {
    try {
      const response = await apiClient.post('/team/invite', { email, name });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateTeamMember: async (id, data) => {
    try {
      const response = await apiClient.put(`/team/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteTeamMember: async (id) => {
    try {
      await apiClient.delete(`/team/${id}`);
    } catch (error) {
      handleError(error);
    }
  },

  getInvoices: async () => {
    try {
      const response = await apiClient.get('/billing/invoices');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getSubscription: async () => {
    try {
      const response = await apiClient.get('/billing/subscription');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateSubscription: async (data) => {
    try {
      const response = await apiClient.put('/billing/subscription', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  submitSupportRequest: async (formData) => {
    try {
      const response = await apiClient.post('/support/request', formData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  saveSettings: async (settingsData) => {
    try {
      const response = await apiClient.put('/settings', settingsData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};
