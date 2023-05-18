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
axios.interceptors.response.use(config => {
  return config
}, async (error) => {
  if (error instanceof AxiosError && error.config) {
    const originalRequest: InternalAxiosRequestConfig | undefined = error.config
    console.log('dasdsa')
    if ((error.response?.status == 401 || error.response?.status == 403) && !error.config._isRetry) {
      originalRequest._isRetry = true
      console.log('401')
      try {
        const axiosResponse: AxiosResponse<{ accessToken: string }> = await axios.get<{ accessToken: string }>(`${API_URL}/users/refresh`, { withCredentials: true })
        localStorage.setItem('token', axiosResponse.data.accessToken)
        return $api.request(originalRequest)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
)

export default $api