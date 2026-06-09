import axios from 'axios';
import { getAuthUser, clearAuthUser, setFlashMessage } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
});

api.interceptors.request.use((config) => {
  const user = getAuthUser();

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuthUser();
      setFlashMessage('Session expired. Please log in again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
