import axios from 'axios'

 export const API_BASE_URL = 'https://emiratiyo-api.fly.dev/api/v1/';

 export const apiClient = axios.create({
   baseURL: API_BASE_URL,
   timeout: 120000,
 })