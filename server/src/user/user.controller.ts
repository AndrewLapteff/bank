import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { Users } from '@prisma/client'
import { UserType } from './types/userType'
import { AuthGuard } from './guards/auth.guard'
import { UserResponse } from './types/userRepsonse'
import { Request, Response } from 'express'
import { UpdateUserData } from './dto/updateUserData'

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
  async login(@Body('user') userCredentials: LoginUserDto, @Req() req: Request, @Res() res: Response): Promise<Response> {
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
  async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
    return await this.userService.refreshAccessToken(req, res)
    // res.send(token)
  }
  @Post('verify')
  async verifyJwt(@Body("token") token: string, @Req() req: Request) {
    return await this.userService.verifyJwt(token)
  }
  @Patch('update')
  @UseGuards(AuthGuard)
  async updateUsersFields(@Body('user') currentUser: Users, @Body('data') newUserData: UpdateUserData) {
    const updatedUser = await this.userService.updateUsersFields(currentUser.id, newUserData)
    return this.userService.buildUserResponse(updatedUser)
  }
}