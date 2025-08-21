import axios from 'axios';
import { attachAuthInterceptor } from './authManager';

const paymentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAYMENT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachAuthInterceptor(
  paymentApi,
  'admin',
  `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-admin`
);

export const getPayments = () => paymentApi.get('/payments');

export default paymentApi;
