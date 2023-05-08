import { Transactions } from "@prisma/client"

export interface TransactionResponse {
  transaction: Transactions
}