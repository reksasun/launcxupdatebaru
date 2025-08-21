import axios from 'axios';

const withdrawalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WITHDRAWAL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

withdrawalApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getWithdrawals = () => withdrawalApi.get('/withdrawals');
export const createWithdrawal = (payload: any) => withdrawalApi.post('/withdrawals', payload);

export default withdrawalApi;
