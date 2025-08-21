import axios, { AxiosInstance } from 'axios';

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

  // Attach token secara otomatis
  api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

const api = createApi();
export default api;
