import axios from 'axios';
import { store } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Lock and subscriber logic for concurrent refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      // To refresh, we usually need the refresh token. 
      // Depending on how we store it, maybe it's in an HTTPOnly cookie or local storage.
      // Assuming it's in store or an HTTPOnly cookie handled by the backend
      // But wait: the backend `/auth/refresh` expects { token: <refreshToken> } inside body.
      // Let's get refresh token from cookies? Or maybe from state?
      // Since local storage doesn't show a refresh token, we probably stored it somewhere else or didn't.
      // In authSlice, we only store 'token' (access token).
      // Let's check `backend/src/controllers/auth.controller.ts` -> how returns?
      // It returns: { message, user, accessToken, refreshToken }.
      // So we must store the refresh token if we want to use it
      // BUT, earlier we only modified authSlice to store `token`.
      // I need to update authSlice to store `refreshToken` too, or use an HttpOnly cookie.
      // Back in `auth.controller.ts`, loginUser returns tokens in JSON. 
      // Okay, let's read the refresh token from localStorage or from the store.
      const state = store.getState();
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        store.dispatch(logout());
        isRefreshing = false;
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          token: refreshToken,
        });

        // Backend returns `{ accessToken, refreshToken }`
        store.dispatch(
          setCredentials({
            user: state.auth.user, // keep existing user
            token: data.accessToken,
          })
        );
        
        // Also update the refresh token in local storage
        localStorage.setItem('refreshToken', data.refreshToken);

        processQueue(null, data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    const message = error.response?.data?.error || 'An unexpected error occurred';
    console.error('[API Error]:', message);
    return Promise.reject(error);
  }
);

export default api;
