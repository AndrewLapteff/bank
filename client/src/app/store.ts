import { makeAutoObservable, runInAction } from "mobx"
import { User } from "../types/User"
import AuthService from "../services/AuthService"
import axios, { AxiosError, AxiosResponse, } from "axios"
import { ErrorArrStr, ErrorStr } from "../types/Error.interface"
import $api, { API_URL, cookies, queryClient } from "../api/api"
import { Transaction } from "../types/Transaction"
import { AmountInfo } from "../types/AmountInfo"
import { ValidateUserFields } from "../components/AccountSettings/AccountSettings"
import TransactionService from "../services/TransactionsService"
import { AddMoneyReponse } from "../types/AddMoneyResponse"


export default class AuthStore {
  user: User = {} as User
  isAuth = false
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }
  setAuth(bool: boolean): void {
    this.isAuth = bool
  }
  setUser(user: User): void {
    this.user = user
  }

  async login(phoneNumber: string, password: string): Promise<AxiosError | undefined> {
    try {
      const response: AxiosResponse<{ user: User }> = await AuthService.login(phoneNumber, password)
      localStorage.setItem('token', response.data.user.accessToken)
      runInAction(() => {
        this.setUser(response.data.user)
        this.setAuth(true)
      })
    } catch (error) {
      if (error instanceof AxiosError)
        return error
    }
  }

  async registration(username: string, phoneNumber: string, password: string): Promise<void | AxiosError<ErrorArrStr>> {
    try {
      const response: AxiosResponse<{ user: User }> = await AuthService.registration(username, phoneNumber, password)
      localStorage.setItem('token', response.data.user.accessToken)
      runInAction(() => {
        this.setUser(response.data.user)
        this.setAuth(true)
      })
    } catch (error) {
      if (error instanceof AxiosError)
        return error
      console.log(error)
    }
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('token')
      this.deleteAllCookies()
      runInAction(() => {
        this.setUser({} as User)
        this.setAuth(false)
      })
    } catch (error) {
      console.log(error)
    }
  }

  deleteAllCookies() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  async checkUser(): Promise<void> {
    if (!cookies.token) {
      runInAction(() => {
        this.isAuth = false
        this.isLoading = false
      })
      return
    }
    try {
      this.isLoading = true
      const axiosResponse: AxiosResponse<User> = await axios.get<User>(`${API_URL}/users/refresh`, { withCredentials: true })
      localStorage.setItem('token', axiosResponse.data.accessToken)
      axiosResponse.data.accessToken = ''
      runInAction(() => {
        this.user = { ...axiosResponse.data }
        this.setAuth(true)
        this.isLoading = false
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        runInAction(() => {
          this.setAuth(false)
          this.setUser({} as User)
          this.isLoading = false
        })
      }
    }
  }

  async updateUserData(newUserData: ValidateUserFields): Promise<AxiosError<ErrorStr> | void> {
    try {
      const axionsResponse: AxiosResponse<User> = await $api<User>({ method: 'patch', url: `${API_URL}/users/update`, data: { data: newUserData }, withCredentials: true, headers: { Authorization: localStorage.getItem('token') } })
      runInAction(() => {
        this.user = Object.assign(this.user, axionsResponse.data)
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        return error
      }
    }
  }
}


export class TransactionsStore {
  transactions = [] as Transaction[]
  isLoading = false
  isError = false
  failureReason = ''
  count = 0
  totalAmount = {} as AmountInfo
  page = 1

  constructor(readonly authStore: AuthStore) {
    this.authStore = authStore
    makeAutoObservable(this)
  }

  setPage(page: number) {
    this.page = page
  }

  async getAllExpencesAndIncomes() {
    try {
      const transactionsAmounts = await queryClient.ensureQueryData([ 'transactionsAmounts' ], {
        queryFn: async () => {
          const axiosResponse: AxiosResponse<{ incomes: string, expenses: string }> = await $api.get('transactions/amount/total', { headers: { Authorization: localStorage.getItem('token') } })
          return axiosResponse.data
        }
      })
      runInAction(() => {
        this.totalAmount.expenses = +transactionsAmounts.expenses
        this.totalAmount.incomes = +transactionsAmounts.incomes
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getTransactionWithLimitOffset(limit: number, page: number) {
    try {
      this.isLoading = true
      const transactions: Transaction[] = await queryClient.ensureQueryData([ 'transactions', page ], {
        queryFn: async () => {
          const axiosResponse: AxiosResponse<{ transactions: Transaction[], count: number }> = await $api.get(`transactions?limit=${limit}&offset=${page * 7 - 7}`, { headers: { Authorization: localStorage.getItem('token') } })
          runInAction(() => {
            this.count = axiosResponse.data.count
          })
          return axiosResponse.data.transactions
        }
      })
      runInAction(() => {
        this.transactions = JSON.parse(JSON.stringify(transactions))
        this.isLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.isLoading = false
        this.isError = true
      })
    }
  }

  getAllTransactionsInRealTme() {
    const eventSource = new EventSource(
      'http://localhost:3000/transactions/sse',
      { withCredentials: true }
    )
    eventSource.onmessage = ({ data }) => {
      getRealTimeData(JSON.parse(data))
    }

    const getRealTimeData = (data: Transaction[]) => {
      runInAction(() => {
        this.transactions = [ ...data ]
      })
    }
  }

  async addMoney(amount: number) {
    try {
      const response: AxiosResponse<AddMoneyReponse> = await TransactionService.addMoney(amount)
      runInAction(() => {
        this.count++
        const countOfPages = Math.ceil(this.count / 7)
        if (countOfPages == this.page && countOfPages >= this.count / 7)
          this.transactions = [ ...this.transactions, response.data.transaction ]
        const user = Object.assign(response.data.user, this.authStore.user)
        this.authStore.setUser(user)
        this.authStore.user.balance = +response.data.transaction.amount + +this.authStore.user.balance
      })
    } catch (error) {
      if (error instanceof AxiosError)
        return error
    }
  }
}


export class SearchStore {
  users: User[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async searchUser(username: string) {
    if (username)
      try {
        const response: AxiosResponse<User[]> = await $api.get(`users/search?user=${username}`)
        runInAction(() => {
          this.users = [ ...response.data ]
        })
      } catch (error) {
        console.log(error)
      }
  }
}