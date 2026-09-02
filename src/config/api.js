import axios from 'axios';
export const API_BASE_URL = 'https://em-bk.vercel.app/api/v1';
export const HEALTH_CHECK_URL = 'https://em-bk.vercel.app/ping';
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000
});
