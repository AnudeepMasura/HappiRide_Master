import axios from 'axios';

// Base API endpoint URL configurability
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor: Automatically attach bearer token to all outgoing API calls
apiClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('happi_admin_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error('Failed to attach Authorization token in request interceptor:', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global handle for auth issues (e.g. 401 token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired
      localStorage.removeItem('happi_admin_user');
      // Redirect to login if in browser context
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
