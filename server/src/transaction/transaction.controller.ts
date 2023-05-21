import { User } from '@app/user/decorators/user.decorator'
import { AuthGuard } from '@app/user/guards/auth.guard'
import { Body, Controller, Get, Post, Query, Req, Sse, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { TransactionDto } from './dto/createTransaction.dto'
import { TransactionService } from './transaction.service'
import { Transactions, Users } from '@prisma/client'
import { TransactionResponse } from './types/transactionResponse.interface'
import { TransactionsResponse } from './types/transactionsResponse.interface'
import { addMoneyDto } from './dto/addMoney.dto'
import { UserService } from '@app/user/user.service'
import { UserResponse } from '@app/user/types/userRepsonse'
import { interval, map } from 'rxjs'
import { Request } from 'express'
import { Decimal } from '@prisma/client/runtime/library'

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
  @Get()
  @UseGuards(AuthGuard)
  async getTransactionsWithLimitOffset(@User('id') currentUserId: number, @Query('limit') limit: string, @Query('offset') offset: string): Promise<TransactionsResponse> {
    return await this.transactionService.getTransactionsWithLimitOffset(currentUserId, limit, offset)
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
  @Get('amount/total')
  @UseGuards(AuthGuard)
  async getAllTransactionsAmount(@User('id') currentUserId: number): Promise<{ incomes: Decimal, expenses: Decimal }> {
    return await this.transactionService.getAllTransactionsAmount(currentUserId)
  }
  @Sse('sse')
  async sse(@Req() req: Request, @Query('limit') limit: string, @Query('offset') offset: string): Promise<any> {
    let refreshToken: string = req.headers.cookie
    refreshToken = refreshToken.slice(6, 1000)
    const user = await this.userService.getUserByRefresh(refreshToken)
    const trans = await this.transactionService.getTransactionsWithLimitOffset(user.id, limit, offset)
    return interval(2000).pipe(map((_) => ({ data: trans })))
  }
}