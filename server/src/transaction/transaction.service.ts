import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { TransactionDto } from './dto/createTransaction.dto'
import { client } from '@app/main'
import { Transactions, Users } from '@prisma/client'
import { TransactionResponse } from './types/transactionResponse.interface'
import { TransactionsResponse } from './types/transactionsResponse.interface'
import { UserService } from '@app/user/user.service'
import { addMoneyDto } from './dto/addMoney.dto'

@Injectable()
export class TransactionService {
  constructor(private readonly userSevice: UserService) { }
  async createTransaction(currentUserId: number, transactionData: TransactionDto, inputPassword: string): Promise<Transactions> {
    const sender: Users = await client.users.findFirst({ where: { id: currentUserId } })
    const receiver: Users = await client.users.findFirst({ where: { id: transactionData.receiverId } })
    const isPasswordCorrect: boolean = await this.userSevice.verifyPassword(inputPassword, sender.password)
    if (!isPasswordCorrect)
      throw new HttpException('Wrong password.', HttpStatus.FORBIDDEN)
    const missing: number = sender.balance - transactionData.amount
    if (missing < 0) {
      const transaction = { ...transactionData, senderId: currentUserId, accepted: false, createdAt: new Date() }
      await client.transactions.create({ data: transaction })
      throw new HttpException(`Not enough money on the balance. ${missing * -1} UAH is missing.`, HttpStatus.FORBIDDEN)
    }
    const transaction = { ...transactionData, senderId: currentUserId, accepted: true, createdAt: new Date() }
    await client.users.update({ where: { id: currentUserId }, data: { balance: sender.balance - transactionData.amount } })
    await client.users.update({ where: { id: receiver.id }, data: { balance: receiver.balance + transactionData.amount } })
    return await client.transactions.create({ data: transaction })
  }
  async addMoney(currentUserId: number, amount: addMoneyDto): Promise<Users> {
    const user: { balance: number } = await client.users.findFirst({ where: { id: currentUserId }, select: { balance: true } })
    const updatedUser: Users = await client.users.update({ where: { id: currentUserId }, data: { balance: user.balance + amount.amount } })
    return updatedUser
  }
  async getAllUserTransactions(currentUserId: number): Promise<Transactions[]> {
    return await client.transactions.findMany({
      where: { OR: [ { senderId: currentUserId }, { receiverId: currentUserId } ] }
    })
  }
  async getAllSentTransactions(currentUserId: number): Promise<Transactions[]> {
    return await client.transactions.findMany({ where: { senderId: currentUserId } })
  }
  async getAllReceiverTransactions(currentUserId: number): Promise<Transactions[]> {
    return await client.transactions.findMany({ where: { receiverId: currentUserId } })
  }
  async buildTransactionResponse(transaction: Transactions): Promise<TransactionResponse> {
    return { transaction }
  }
  async buildTransactionsResponse(transactions: Transactions[]): Promise<TransactionsResponse> {
    return { transactions: transactions, transactionsCount: transactions.length }
  }
}
