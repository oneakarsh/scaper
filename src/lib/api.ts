import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
};

// Resort APIs
export const resortAPI = {
  getAll: () => api.get('/resorts'),
  getById: (id: string) => api.get(`/resorts/${id}`),
  create: (data: any) => api.post('/resorts', data),
  update: (id: string, data: any) => api.put(`/resorts/${id}`, data),
  delete: (id: string) => api.delete(`/resorts/${id}`),
};

// Booking APIs
export const bookingAPI = {
  create: (data: any) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
  getAllAdmin: () => api.get('/bookings/admin/all'),
};

export default api;
