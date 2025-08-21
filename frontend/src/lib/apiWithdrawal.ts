import axios from 'axios';
import { attachAuthInterceptor } from './authManager';

const withdrawalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WITHDRAWAL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachAuthInterceptor(
  withdrawalApi,
  'admin',
  `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-admin`
);

export const getWithdrawals = () => withdrawalApi.get('/withdrawals');
export const createWithdrawal = (payload: any) => withdrawalApi.post('/withdrawals', payload);
export const getClientWithdrawals = (clientId: string, params?: any) =>
  withdrawalApi.get(`/admin/clients/${clientId}/withdrawals`, { params });
export const getClientSubwallets = (clientId: string) =>
  withdrawalApi.get(`/admin/clients/${clientId}/subwallets`);

export default withdrawalApi;
