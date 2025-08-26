import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_HOST;
const API_KEY = process.env.REACT_APP_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    config.headers = {
      ...config.headers,
      'x-api-key': API_KEY,
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
