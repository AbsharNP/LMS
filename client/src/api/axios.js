import axios from 'axios';
import { getAuthUser } from '../utils/auth';

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

export default api;
