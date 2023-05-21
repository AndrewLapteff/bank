import $api from "../api/api"
import { Transaction } from "../types/Transaction"

export default class TransactionService {
  static async getAllTransactions() {
    return $api.get<Transaction[]>('transactions/all', {
      headers: { Authorization: localStorage.getItem('token') }
    })
  }
}
