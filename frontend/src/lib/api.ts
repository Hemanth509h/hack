import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for easy error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'An unexpected error occurred';
    console.error('[API Error]:', message);
    return Promise.reject(error);
  }
);

export default api;
