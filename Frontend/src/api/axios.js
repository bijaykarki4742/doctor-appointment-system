import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: '/api', // Proxy will prepend this with "http://localhost:3000"
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
    if (error.response?.status === 401) {
      console.log(error)
    }
    return Promise.reject(error);
  }
);

export default api;