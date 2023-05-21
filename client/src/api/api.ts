import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const API_URL = 'http://localhost:3000'

const $api: AxiosInstance = axios.create({ withCredentials: true, baseURL: API_URL })

axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

// покриває помилки крім checkUser
document.cookie.length != 0 && axios.interceptors.response.use(config => {
  return config
}, async (error) => {
  if (error instanceof AxiosError && error.config) {
    const originalRequest: InternalAxiosRequestConfig | undefined = error.config
    if (error.response?.status === 401) {
      console.log('refresh is dead')
      return
    }
    if (error.response?.status !== 403) {
      try {
        const axiosResponse: AxiosResponse<{ accessToken: string }> = await axios.get<{ accessToken: string }>(`${API_URL}/users/refresh`, { withCredentials: true })
        console.log('access is dead', axiosResponse.data.accessToken)
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