import axios, { AxiosInstance } from 'axios';
import { attachAuthInterceptor } from './authManager';

type Service = 'default' | 'auth' | 'payment' | 'withdrawal';

const baseURLMap: Record<Service, string | undefined> = {
  default: process.env.NEXT_PUBLIC_API_URL,
  auth: process.env.NEXT_PUBLIC_AUTH_URL,
  payment: process.env.NEXT_PUBLIC_PAYMENT_URL,
  withdrawal: process.env.NEXT_PUBLIC_WITHDRAWAL_URL,
};

export const createApi = (service: Service = 'default'): AxiosInstance => {
  const api = axios.create({
    baseURL: baseURLMap[service],
    headers: {
      'Content-Type': 'application/json',
    },
  });

  attachAuthInterceptor(
    api,
    'admin',
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-admin`
  );

  return api;
};

const api = createApi();
export default api;
