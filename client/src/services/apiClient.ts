import axios from 'axios';

// Ensure the backend url matches what we saw in postman or env variables.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Authorization token
apiClient.interceptors.request.use(
  (config) => {
    // Check localStorage or you could grab this from the Redux store
    // For simplicity globally, local storage is easiest for initialization.
    const token = localStorage.getItem('kreditkard_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
