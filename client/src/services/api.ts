import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const lessonAPI = {
  getAll: () => api.get('/lessons'),
  getById: (id: string) => api.get(`/lessons/${id}`),
  create: (data: any) => api.post('/lessons', data),
  update: (id: string, data: any) => api.put(`/lessons/${id}`, data),
  delete: (id: string) => api.delete(`/lessons/${id}`),
};

export const childAPI = {
  getAll: () => api.get('/children'),
  getById: (id: string) => api.get(`/children/${id}`),
  create: (data: any) => api.post('/children', data),
  update: (id: string, data: any) => api.put(`/children/${id}`, data),
  delete: (id: string) => api.delete(`/children/${id}`),
};

export const sessionAPI = {
  getAll: () => api.get('/sessions'),
  getById: (id: string) => api.get(`/sessions/${id}`),
  create: (data: any) => api.post('/sessions', data),
  update: (id: string, data: any) => api.put(`/sessions/${id}`, data),
  delete: (id: string) => api.delete(`/sessions/${id}`),
  addMessage: (id: string, message: any) => api.post(`/sessions/${id}/messages`, message),
};

export const authAPI = {
  login: (credentials: { username: string; password: string }) => 
    api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};