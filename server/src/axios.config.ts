import { AxiosRequestConfig } from 'axios'

export const axiosConfig: AxiosRequestConfig = {
  baseURL: 'http://localhost:3000',
  headers: {
    "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  },
}