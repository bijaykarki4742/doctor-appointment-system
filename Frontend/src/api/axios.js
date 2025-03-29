import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: '/api', // Proxy will prepend this with "http://localhost:3000"
  withCredentials: true, // Enable cookies/auth (if needed)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors (optional)
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists (example)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;