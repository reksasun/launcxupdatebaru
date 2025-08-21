import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export type UserRole = 'admin' | 'client';

const TOKEN_KEY: Record<UserRole, string> = {
  admin: 'adminToken',
  client: 'clientToken',
};

export const authManager = {
  getToken(role: UserRole): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY[role]);
  },
  setToken(role: UserRole, token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY[role], token);
  },
  clearToken(role: UserRole) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY[role]);
  },
};

export function attachAuthInterceptor(
  api: AxiosInstance,
  role: UserRole,
  refreshUrl: string
) {
  let isRefreshing = false;
  let queue: Array<(token: string | null) => void> = [];

  const processQueue = (token: string | null) => {
    queue.forEach(cb => cb(token));
    queue = [];
  };

  api.interceptors.request.use(config => {
    const token = authManager.getToken(role);
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalConfig = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (status === 401 && originalConfig && !originalConfig._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queue.push(token => {
              if (token) {
                if (originalConfig.headers) {
                  (originalConfig.headers as any).Authorization = `Bearer ${token}`;
                }
                originalConfig._retry = true;
                resolve(api(originalConfig));
              } else {
                reject(error);
              }
            });
          });
        }

        originalConfig._retry = true;
        isRefreshing = true;

        try {
          const resp = await axios.post(refreshUrl, {}, { withCredentials: true });
          const newToken = (resp.data as any)?.accessToken;
          if (!newToken) throw new Error('No token returned');
          authManager.setToken(role, newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          processQueue(newToken);
          if (originalConfig.headers) {
            (originalConfig.headers as any).Authorization = `Bearer ${newToken}`;
          }
          return api(originalConfig);
        } catch (err) {
          processQueue(null);
          authManager.clearToken(role);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}
