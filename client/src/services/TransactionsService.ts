import $api from "../api/api"
import { TransactionType } from "../types/TransacionType"

export default class TransactionService {
  static async getAllTransactions() {
    return $api.get<TransactionType[]>('transactions/all', {
      headers: { Authorization: localStorage.getItem('token') }
    })
  }
}
