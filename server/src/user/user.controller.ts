import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { Users } from '@prisma/client'
import { UserType } from './types/userType'
import { AuthGuard } from './guards/auth.guard'
import { UserResponse } from './types/userRepsonse'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post('registration')
  @UsePipes(new ValidationPipe())
  createUser(@Body('user') user: CreateUserDto): Promise<UserType> {
    console.log(user)
    return this.userService.createUser(user)
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') userCredentials: LoginUserDto): Promise<UserResponse> {
    const user = await this.userService.login(userCredentials)
    return this.userService.buildUserResponse(user)
  }
  @Get()
  @UseGuards(AuthGuard)
  async getCurrentUser(@Body('user') userCredentials: Users): Promise<UserResponse> {
    const user: UserType = await this.userService.getCurrentUser(userCredentials.id)
    return this.userService.buildUserResponse(user)
  }
}