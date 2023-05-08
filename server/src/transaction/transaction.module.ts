import { Module } from '@nestjs/common'
import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { UserService } from '@app/user/user.service'

@Module({ controllers: [ TransactionController ], providers: [ TransactionService, UserService ] })
export class TransactionModule { }
