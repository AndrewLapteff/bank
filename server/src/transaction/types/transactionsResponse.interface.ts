import { Transactions } from "@prisma/client"

export interface TransactionsResponse {
  transactions: Transactions[],
  count: number
}