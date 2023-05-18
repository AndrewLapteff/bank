import $api from "../api/api"
import { AxiosResponse } from "axios"
import { UserType } from "../types/UserType"

export default class AuthService {
  static async login(phoneNumber: string, password: string): Promise<AxiosResponse<{ user: UserType }>> {
    const user = { phoneNumber: '+38' + phoneNumber, password }
    return $api.post<{ user: UserType }>(
      '/users/login', { user },
    )
  }
  static async registration(username: string, phoneNumber: string, password: string): Promise<AxiosResponse<{ user: UserType }>> {
    const user = { username, phoneNumber: '+38' + phoneNumber, password }
    return $api.post<{ user: UserType }>(
      '/users/registration', { user },
    )
  }
}