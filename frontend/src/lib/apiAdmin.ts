import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getAdminUsers = () => adminApi.get('/users');
export const createAdminUser = (payload: { name: string; email: string; password: string; role: string }) =>
  adminApi.post('/users', payload);
export const deleteAdminUser = (id: string) => adminApi.delete(`/users/${id}`);

export default adminApi;
