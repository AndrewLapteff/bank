import { Transactions, Users } from "@prisma/client"

export interface AddMoneyReponse {
  user: Users,
  transaction: Transactions
}