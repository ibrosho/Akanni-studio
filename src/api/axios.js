import axios from 'axios';

// In development: reads http://localhost:5000 from .env.local (VITE_API_URL=http://localhost:5000)
// In production:  reads your live Render backend URL set in Vercel environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
