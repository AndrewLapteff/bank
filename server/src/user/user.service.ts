import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateUserDto } from './dto/createUser.dto'
import { hash, compare } from 'bcrypt'
import { LoginUserDto } from './dto/loginUser.dto'
import { sign, verify } from 'jsonwebtoken'
import { UserType } from './types/userType'
import { client } from '../main'
import { Request, Response } from 'express'

@Injectable()
export class UserService {

  async createUser(user: CreateUserDto): Promise<UserType> {
    const { refreshToken } = await this.createRefreshToken(user.phoneNumber, user.username)
    const newUser: UserType = await client.users.create({
      data: {
        token: '',
        username: this.correctFullName(user.username),
        phoneNumber: user.phoneNumber,
        cardNumber: this.generateSequentialNumber(),
        password: await this.createPassword(user.password),
        balance: 0,
        createdAt: new Date()
      }
    })
    return newUser
  }

  async login(userCredentials: LoginUserDto, request: Request, response: Response): Promise<Response> {
    const currentUser: UserType = await client.users.findFirst({ where: { phoneNumber: userCredentials.phoneNumber } })
    if (!currentUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const isPasswordCorrect: boolean = await this.verifyPassword(userCredentials.password, currentUser.password)
    if (!isPasswordCorrect)
      throw new HttpException('Password incorrect', HttpStatus.FORBIDDEN)
    const { accessToken } = await this.createAccessToken(currentUser)
    const { refreshToken } = await this.createRefreshToken(currentUser.phoneNumber, currentUser.username)
    this.updateRefreshTokenInDB(refreshToken, userCredentials.phoneNumber)
    response.cookie('token', refreshToken, { httpOnly: false, secure: true, maxAge: 2592000000 })
    currentUser.token = accessToken
    return response.send(this.buildUserResponse(currentUser))
  }

  async getCurrentUser(id: number): Promise<UserType> {
    const currentUser: UserType = await client.users.findFirst({ where: { id } })
    const { accessToken } = await this.createAccessToken(currentUser)
    currentUser.token = accessToken
    return currentUser
  }

  async getUserByRefresh(token: string): Promise<UserType> {
    const currentUser: UserType = await client.users.findFirst({ where: { token } })
    return currentUser
  }

  async createAccessToken(user: Users): Promise<{ accessToken: string }> {
    const accessToken = sign({ id: user.id, phoneNumber: user.phoneNumber, balance: user.balance, cardNumber: user.cardNumber, }, process.env.SECRET, { expiresIn: '30m' })
    return { accessToken }
  }

  async createRefreshToken(phoneNumber: string, username: string): Promise<{ refreshToken: string }> {
    const refreshToken = sign({ phoneNumber, username }, process.env.SECRET, { expiresIn: '30d' })
    return { refreshToken }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<Response<{ accessToken: string }>> {
    let refreshToken: string = req.headers.cookie
    if (!refreshToken) {
      throw new HttpException('Login, please', HttpStatus.UNAUTHORIZED)
    }
    refreshToken = refreshToken.slice(6, 1000)
    const user = await client.users.findFirst({ where: { token: refreshToken }, select: { id: true, username: true, cardNumber: true, balance: true, phoneNumber: true } })
    if (!user) {
      res.cookie('token', '')
      return res.send({ accessToken: '' })
    }
    const accessToken = sign({ id: user.id, phoneNumber: user.phoneNumber, balance: user.balance, cardNumber: user.cardNumber, }, process.env.SECRET, { expiresIn: '30m' })
    return res.send({ ...user, accessToken })
  }

  async updateRefreshTokenInDB(refreshToken: string, phoneNumber: string): Promise<void> {
    await client.users.update({ where: { phoneNumber: phoneNumber }, data: { token: refreshToken } })
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      return verify(token, process.env.SECRET)
    } catch (error) {
      throw new HttpException('Update access please', HttpStatus.FORBIDDEN)
    }
  }

  createPassword(password: string): Promise<string> {
    return hash(password, 10)
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }


  buildUserResponse(user: Users): { user: UserType } {
    delete user.password
    delete user.createdAt
    return { user }
  }

  generateSequentialNumber(): number {
    var randomNumber = ''

    for (var i = 0; i < 16; i++) {
      var digit = Math.floor(Math.random() * 10)
      randomNumber += digit
    }

    return +randomNumber
  }

  correctFullName(fullname: string): string {
    fullname = fullname.toLowerCase().trim()
    let nameAndSurname = fullname.split(' ')
    let result: string = ''
    nameAndSurname.forEach((credential, idx) => {
      let isSpace = ' '
      if (idx === 1)
        isSpace = ''
      let chars = credential.split('')
      result += chars[ 0 ].toUpperCase() + credential.slice(1) + isSpace
    })
    return result
  }

}