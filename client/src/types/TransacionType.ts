export type TransactionType = {
  id: number
  senderId: number
  receiverId: number
  createdAt: Date
  totalAmount: number
  amount: number
  commission: number
  message: string
  accepted: boolean
}