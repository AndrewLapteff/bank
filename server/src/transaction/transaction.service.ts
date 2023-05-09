import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { TransactionDto } from './dto/createTransaction.dto'
import { client } from '@app/main'
import { Transactions, Users } from '@prisma/client'
import { TransactionResponse } from './types/transactionResponse.interface'
import { TransactionsResponse } from './types/transactionsResponse.interface'
import { UserService } from '@app/user/user.service'
import { addMoneyDto } from './dto/addMoney.dto'
import { Decimal } from '@prisma/client/runtime'

@Injectable()
export class TransactionService {
  constructor(private readonly userSevice: UserService) { }
  async createTransaction(currentUserId: number, transactionData: TransactionDto, inputPassword: string): Promise<Transactions> {
    const sender: Users = await client.users.findFirst({ where: { id: currentUserId } })
    const receiver: Users = await client.users.findFirst({ where: { cardNumber: transactionData.cardNumber } })
    if (!receiver || !sender)
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    const isPasswordCorrect: boolean = await this.userSevice.verifyPassword(inputPassword, sender.password)
    if (!isPasswordCorrect)
      throw new HttpException('Wrong password.', HttpStatus.FORBIDDEN)
    delete transactionData.cardNumber
    const missing = sender.balance.minus(transactionData.amount)
    if (missing.isNegative()) {
      const transaction = { ...transactionData, totalAmount: transactionData.amount.toFixed(2), commission: new Decimal(0), receiverId: receiver.id, senderId: currentUserId, accepted: false, createdAt: new Date() }
      await client.transactions.create({ data: transaction })
      throw new HttpException(`Not enough money on the balance. ${missing.abs()} UAH is missing.`, HttpStatus.FORBIDDEN)
    }
    let { amount, commission } = await this.createCommission(transactionData.amount)
    const transaction = { ...transactionData, amount: amount.toFixed(2), totalAmount: commission + amount, commission: commission.toFixed(2), receiverId: receiver.id, senderId: currentUserId, accepted: true, createdAt: new Date() }
    await client.users.update({ where: { id: currentUserId }, data: { balance: sender.balance.minus(transactionData.amount) } })
    await client.users.update({ where: { id: receiver.id }, data: { balance: receiver.balance.plus(transactionData.amount) } })
    return await client.transactions.create({ data: transaction })
  }
  async addMoney(currentUserId: number, amount: addMoneyDto): Promise<Users> {
    const user: { balance: Decimal } = await client.users.findFirst({ where: { id: currentUserId }, select: { balance: true } })
    const updatedUser: Users = await client.users.update({ where: { id: currentUserId }, data: { balance: user.balance.plus(amount.amount) } })
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
  async createCommission(amount: number): Promise<{ amount: number, commission: number }> {
    let amountWithoutCommission = amount
    amount = amount / 100 * 99
    const commission = amountWithoutCommission - amount
    const bankBalance: Users = await client.users.findFirst({ where: { id: 1 } })
    bankBalance.balance = bankBalance.balance.plus(commission)
    await client.users.update({ where: { id: 1 }, data: bankBalance })
    return { amount: amount, commission: commission }
  }
  async buildTransactionResponse(transaction: Transactions): Promise<TransactionResponse> {
    return { transaction }
  }
  async buildTransactionsResponse(transactions: Transactions[]): Promise<TransactionsResponse> {
    return { transactions: transactions, transactionsCount: transactions.length }
  }
}
