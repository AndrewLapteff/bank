import { makeAutoObservable } from "mobx"
import { UserType } from "../types/UserType"
import AuthService from "../services/AuthService"
import axios, { AxiosError, AxiosResponse, } from "axios"
import { IError } from "../types/Error.interface"
import $api, { API_URL, queryClient } from "../api/api"
import { TransactionType } from "../types/TransacionType"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import TransactionService from "../services/TransactionsService"

export default class AuthStore {
  user: UserType = {} as UserType
  isAuth = false
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }
  setAuth(bool: boolean): void {
    this.isAuth = bool
  }
  setUser(user: UserType): void {
    this.user = user
  }
  async login(phoneNumber: string, password: string): Promise<void | AxiosError<IError>> {
    try {
      const response: AxiosResponse<{ user: UserType }> = await AuthService.login(phoneNumber, password)
      localStorage.setItem('token', response.data.user.token)
      this.setUser(response.data.user)
      this.setAuth(true)
    } catch (error: any) {
      return error
    }
  }
  async registration(username: string, phoneNumber: string, password: string): Promise<void | AxiosError<IError>> {
    try {
      const response: AxiosResponse<{ user: UserType }> = await AuthService.registration(username, phoneNumber, password)
      localStorage.setItem('token', response.data.user.token)
      this.setUser(response.data.user)
      this.setAuth(true)
    } catch (error: any) {
      return error
    }
  }
  async logout(): Promise<void> {
    try {
      localStorage.removeItem('token')
      this.setUser({} as UserType)
      this.setAuth(false)
    } catch (error: any) {
      console.log(error)
    }
  }
  async checkUser(): Promise<void> {
    try {
      this.isLoading = true
      const axiosResponse: AxiosResponse<{ accessToken: string }> = await axios.get<{ accessToken: string }>(`${API_URL}/users/refresh`, { withCredentials: true })
      localStorage.setItem('token', axiosResponse.data.accessToken)
      this.setAuth(true)
      this.isLoading = false
    } catch (error) {
      if (error instanceof AxiosError) {
        this.setAuth(false)
        this.setUser({} as UserType)
        this.isLoading = false
      }
    }
  }
}

export class TransactionsStore {
  transactions = [] as TransactionType[]
  isLoading = false
  isError = false
  failureReason = ''

  setTrasactions(newTransaction: []) {
    this.transactions = JSON.parse(JSON.stringify(newTransaction))
  }

  async getAllTransaction() {
    const transaction = await queryClient.fetchQuery([ 'transactions' ], {
      queryFn: () => {
        $api.get('transactions/all', { headers: { Authorization: localStorage.getItem('token') } })
          .then(response => console.log(response))
      }
    })
  }
}