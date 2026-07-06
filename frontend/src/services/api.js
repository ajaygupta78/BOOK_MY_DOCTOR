import axios from 'axios';

// Central Axios Client pointing to our Flask Backend development server port
const API = axios.create({
  baseURL: 'https://book-my-doctor-2pyd.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Outgoing Request Interceptor: Automatically injects JWT Bearer credentials from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catches session timeouts (401/403) and logs user out automatically
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401)) {
      // Token expired or invalid, wipe local session cache
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch refresh or let application redirect
    }
    return Promise.reject(error);
  }
);

export default API;
