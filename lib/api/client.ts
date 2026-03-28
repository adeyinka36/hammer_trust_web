import axios, { type AxiosInstance } from 'axios';
import { getApiBaseUrl } from '@/lib/config';

const TOKEN_HEADER = 'Authorization';

export function createApiClient(getToken: () => string | null): AxiosInstance {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 30_000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.set(TOKEN_HEADER, `Bearer ${token}`);
    } else {
      config.headers.delete(TOKEN_HEADER);
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type');
    }
    return config;
  });

  return client;
}
