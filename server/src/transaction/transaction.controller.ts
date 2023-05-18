import { User } from '@app/user/decorators/user.decorator'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { Body, Controller, Get, Post, Sse, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { TransactionDto } from './dto/createTransaction.dto'
import { TransactionService } from './transaction.service'
import { Transactions, Users } from '@prisma/client'
import { TransactionResponse } from './types/transactionResponse.interface'
import { TransactionsResponse } from './types/transactionsResponse.interface'
import { addMoneyDto } from './dto/addMoney.dto'
import { UserService } from '@app/user/user.service'
import { UserResponse } from '@app/user/types/userRepsonse'
import { interval, map } from 'rxjs'

interface MessageEvent {
  data: string | object
  id?: string
  type?: string
  retry?: number
}

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService) { }
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createTransaction(@User('id') currentUserId: number, @Body('transaction') transactionData: TransactionDto,
    @Body('password') inputPassword: string): Promise<TransactionResponse> {
    const transaction: Transactions = await this.transactionService.createTransaction(currentUserId, transactionData, inputPassword)
    return this.transactionService.buildTransactionResponse(transaction)
  }
  @Post('add')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async addMoney(@User('id') currentUserId: number, @Body() amount: addMoneyDto): Promise<UserResponse> {
    const user: Users = await this.transactionService.addMoney(currentUserId, amount)
    return this.userService.buildUserResponse(user)
  }
  @Get('all')
  @UseGuards(AuthGuard)
  async getAllUserTransactions(@User('id') currentUserId: number): Promise<TransactionsResponse> {
    const transactions: Transactions[] = await this.transactionService.getAllSentTransactions(currentUserId)
    return this.transactionService.buildTransactionsResponse(transactions)
  }
  @Get('sent')
  @UseGuards(AuthGuard)
  async getAllSentTransactions(@User('id') currentUserId: number): Promise<TransactionsResponse> {
    const transactions: Transactions[] = await this.transactionService.getAllSentTransactions(currentUserId)
    return this.transactionService.buildTransactionsResponse(transactions)
  }
  @Get('received')
  @UseGuards(AuthGuard)
  async getAllReceiverTransactions(@User('id') currentUserId: number): Promise<TransactionsResponse> {
    const transactions: Transactions[] = await this.transactionService.getAllReceiverTransactions(currentUserId)
    return this.transactionService.buildTransactionsResponse(transactions)
  }
  @Sse('sse')
  async sse(): Promise<any> {
    const trans = await this.transactionService.testGet()
    return interval(2000).pipe(map((_) => ({ data: trans })))
  }
}
