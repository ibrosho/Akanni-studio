import axios from 'axios';

// In development: reads http://localhost:5000 from .env.local (VITE_API_URL=http://localhost:5000)
// In production:  reads your live Render backend URL set in Vercel environment variables
// Triggering redeployment with correct environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept outgoing requests to inject the JWT from localStorage in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('arc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
