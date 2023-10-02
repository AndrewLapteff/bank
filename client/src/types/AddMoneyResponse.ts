import { Transaction } from "./Transaction"
import { User } from "./User"

export interface AddMoneyReponse {
  user: User,
  transaction: Transaction
}