import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { TransactionModule } from './transaction/transaction.module'
import { HttpModule } from '@nestjs/axios'
import { axiosConfig } from './axios.config'

@Module({
  imports: [
    UserModule,
    TransactionModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        ...axiosConfig,
      }),
    }), ],
  controllers: [ AppController ],
  providers: [
    AppService ],
})
export class AppModule { }
