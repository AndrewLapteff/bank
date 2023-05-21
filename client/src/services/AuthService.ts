import $api from "../api/api"
import { AxiosResponse } from "axios"
import { User } from "../types/User"

export default class AuthService {
  static async login(phoneNumber: string, password: string): Promise<AxiosResponse<{ user: User }>> {
    const user = { phoneNumber: '+38' + phoneNumber, password }
    return $api.post<{ user: User }>(
      '/users/login', { user },
    )
  }
  static async registration(username: string, phoneNumber: string, password: string): Promise<AxiosResponse<{ user: User }>> {
    const user = { username, phoneNumber: '+38' + phoneNumber, password }
    return $api.post<{ user: User }>(
      '/users/registration', { user },
    )
  }
}