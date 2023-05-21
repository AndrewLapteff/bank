export interface Transaction {
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