import axios from 'axios';
import type { ApiErrorBody } from '../types';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorBody>(error) && error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      if (!window.location.hash.includes('/signin')) {
        window.location.hash = '/signin';
      }
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string | string[] {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;
    if (message) return message;
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to the server. Check that the API is running and the URL is correct.';
    }
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
