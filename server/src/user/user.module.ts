import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { axiosConfig } from '@app/axios.config'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ HttpModule.registerAsync({
    useFactory: () => ({
      ...axiosConfig,
    }),
  }), ],
  controllers: [ UserController ],
  providers: [ UserService ]
})
export class UserModule { }