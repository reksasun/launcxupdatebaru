import axios from 'axios';

const paymentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAYMENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

paymentApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getPayments = () => paymentApi.get('/payments');

export default paymentApi;
