import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { QueryClient } from '@tanstack/react-query'
import AuthStore from '../app/store'

export const queryClient = new QueryClient()

export const API_URL = 'http://localhost:3000'
const auth = new AuthStore
const $api: AxiosInstance = axios.create({ withCredentials: true, baseURL: API_URL })
export const cookies = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)))

if (cookies.token && cookies.token.length == 0) {
  auth.logout()
}


axios.interceptors.request.use(config => {
  if (!cookies.token) {
    return config
  }
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

// покриває помилки крім checkUser
document.cookie.length != 0 && axios.interceptors.response.use(config => {
  return config
}, async (error) => {
  if (error instanceof AxiosError && error.config) {
    const originalRequest: InternalAxiosRequestConfig | undefined = error.config
    if (error.response?.status === 403) {
      console.log('refresh is dead')
      return
    }
    if (error.response?.status !== 401) {
      try {
        const axiosResponse: AxiosResponse<{ accessToken: string }> = await axios.get<{ accessToken: string }>(`${API_URL}/users/refresh`, { withCredentials: true })
        localStorage.setItem('token', axiosResponse.data.accessToken)
        return $api.request(originalRequest)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
  return
}
)

export default $api