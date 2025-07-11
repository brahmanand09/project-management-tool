import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

// Automatically attach JWT to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
