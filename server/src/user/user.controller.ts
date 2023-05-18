import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { Users } from '@prisma/client'
import { UserType } from './types/userType'
import { AuthGuard } from './guards/auth.guard'
import { UserResponse } from './types/userRepsonse'
import { Request, Response } from 'express'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post('registration')
  @UsePipes(new ValidationPipe())
  createUser(@Body('user') user: CreateUserDto): Promise<UserType> {
    return this.userService.createUser(user)
  }
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') userCredentials: LoginUserDto, @Req() req: Request, @Res() res: Response): Promise<any> {
    return await this.userService.login(userCredentials, req, res)
    // return this.userService.buildUserResponse(user)
  }
  @Get()
  @UseGuards(AuthGuard)
  async getCurrentUser(@Body('user') userCredentials: Users): Promise<UserResponse> {
    const user: UserType = await this.userService.getCurrentUser(userCredentials.id)
    return this.userService.buildUserResponse(user)
  }
  @Get('refresh')
  async getNewAccessToken(@Req() req: Request) {
    return this.userService.createNewAccessToken(req)
  }
  @Post('verify')
  async verifyJwt(@Body("token") token: string, @Req() req: Request) {
    return await this.userService.verifyJwt(token)
  }
}