import axios from 'axios';
import { attachAuthInterceptor } from './authManager';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

attachAuthInterceptor(
  apiClient,
  'client',
  `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-client`
);

export default apiClient;
