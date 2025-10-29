import axios from 'axios';

// Configuration for different APIs
const API_CONFIG = {
  // Your .NET API (for suppliers - local for now)
  dotnet: 'http://localhost:5124/api',

  // Your Node.js API (for auth and screening)
  // In development, use relative URLs to leverage proxy
  // In production, use full URL
  nodejs:
    process.env.NODE_ENV === 'production'
      ? 'https://web-scraping-for-high-risk-entities-lwp7.onrender.com'
      : '', // Empty string = relative URLs for proxy
};

const API_URL = API_CONFIG.dotnet;

// Base axios configuration for .NET API (suppliers)
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Supplier services
export const supplierService = {
  getAll: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (supplier) => {
    const response = await api.post('/suppliers', supplier);
    return response.data;
  },

  update: async (id, supplier) => {
    const response = await api.put(`/suppliers/${id}`, supplier);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/suppliers/${id}`);
    return true;
  },
};

// Create separate axios instance for Node.js API (auth and screening)
const nodeApi = axios.create({
  baseURL: API_CONFIG.nodejs,
  timeout: 30000, // Render can be slower
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor for Node.js API
nodeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for Node.js API
nodeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await nodeApi.post('/auth/register', userData);
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await nodeApi.post('/auth/login', credentials);
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await nodeApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  validateToken: async () => {
    // Since there's no validate endpoint, we'll try to get sources as validation
    try {
      const response = await nodeApi.get('/api/sources');
      return { valid: response.data.success };
    } catch (error) {
      return { valid: false };
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

// Screening services (using Node.js API)
export const screeningService = {
  getSources: async () => {
    const response = await nodeApi.get('/api/sources');
    return response.data;
  },

  screenEntity: async (entityName, sources = []) => {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('entityName', entityName);

    // Add sources if provided
    if (sources.length > 0) {
      sources.forEach((source) => {
        params.append('sources', source);
      });
    }

    const response = await nodeApi.get(`/api/search?${params.toString()}`);
    return response.data;
  },

  // Legacy method for backward compatibility
  screenSupplier: async (supplierId, sources) => {
    // This would require getting supplier name first, or we can modify to use entity name directly
    console.warn('screenSupplier is deprecated, use screenEntity instead');
    return await screeningService.screenEntity(
      `Supplier-${supplierId}`,
      sources
    );
  },
};

export default api;
