import $api from "../api/api"
import { AddMoneyReponse } from "../types/AddMoneyResponse"
import { Transaction } from "../types/Transaction"

export default class TransactionService {
  static async getAllTransactions() {
    return $api.get<Transaction[]>('transactions/all', {
      headers: { Authorization: localStorage.getItem('token') }
    })
  }
  static async addMoney(amount: number) {
    return $api<AddMoneyReponse>({ method: 'post', url: `transactions/add`, data: { amount }, withCredentials: true, headers: { Authorization: localStorage.getItem('token') } })
  }
}
