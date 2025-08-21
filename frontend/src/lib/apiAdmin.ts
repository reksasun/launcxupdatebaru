import axios from 'axios';
import { attachAuthInterceptor } from './authManager';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachAuthInterceptor(
  adminApi,
  'admin',
  `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-admin`
);

export const getAdminUsers = () => adminApi.get('/users');
export const createAdminUser = (payload: { name: string; email: string; password: string; role: string }) =>
  adminApi.post('/users', payload);
export const deleteAdminUser = (id: string) => adminApi.delete(`/users/${id}`);

export default adminApi;
