import axios from 'axios';

const API_URL = 'http://localhost:5124/api'; // Adjust according to your development port

// Base axios configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Screening services
export const screeningService = {
  getSources: async () => {
    const response = await api.get('/screening/sources');
    return response.data;
  },

  screenSupplier: async (supplierId, sources) => {
    const response = await api.post('/screening', { supplierId, sources });
    return response.data;
  },
};
