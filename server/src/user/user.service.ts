import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateUserDto } from './dto/createUser.dto'
import { hash, compare } from 'bcrypt'
import { LoginUserDto } from './dto/loginUser.dto'
import { sign, verify } from 'jsonwebtoken'
import { UserType } from './types/userType'
import { client } from '../main'
import { Request, Response } from 'express'
import { UpdateUserData } from './dto/updateUserData'
import { SearchUser } from './types/seatchUser'

@Injectable()
export class UserService {

  async createUser(user: CreateUserDto): Promise<UserType> {
    const { refreshToken } = await this.createRefreshToken(user.phoneNumber, user.username)
    const newUser: UserType = await client.users.create({
      data: {
        token: refreshToken,
        username: this.correctFullName(user.username),
        phoneNumber: user.phoneNumber,
        cardNumber: this.generateSequentialNumber(16),
        CVV: this.generateSequentialNumber(3),
        password: await this.createPassword(user.password),
        balance: 0,
        createdAt: new Date()
      }
    })
    return newUser
  }

  async searchUser(username: string): Promise<SearchUser[]> {
    if (!username) {
      throw new HttpException('No users', HttpStatus.NOT_FOUND)
    }
    username = this.correctFullName(username)
    const users = await client.users.findMany({ where: { username: { startsWith: username } }, select: { id: true, cardNumber: true, phoneNumber: true, username: true } })

    return users
  }

  async login(userCredentials: LoginUserDto, request: Request, response: Response): Promise<Response> {
    const currentUser: UserType = await client.users.findFirst({ where: { phoneNumber: userCredentials.phoneNumber } })
    if (!currentUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const isPasswordCorrect: boolean = await this.verifyPassword(userCredentials.password, currentUser.password)
    if (!isPasswordCorrect)
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED)
    const { accessToken } = await this.createAccessToken(currentUser)
    const { refreshToken } = await this.createRefreshToken(currentUser.phoneNumber, currentUser.username)
    this.updateRefreshTokenInDB(refreshToken, userCredentials.phoneNumber)
    response.cookie('token', refreshToken, { httpOnly: false, secure: true, maxAge: 2592000000 })
    currentUser.token = accessToken
    return response.send(this.buildUserResponse(currentUser))
  }

  async getCurrentUser(id: number): Promise<UserType> {
    const currentUser: UserType = await client.users.findFirst({ where: { id } })
    const { accessToken } = await this.createAccessToken(currentUser) //fdsfs
    currentUser.token = accessToken
    return currentUser
  }

  async updateUsersFields(id: number, newUserData: UpdateUserData): Promise<Users> {
    const currentUser: UserType = await client.users.findFirst({
      where: { id }
    })
    const isPasswordCorrect = await this.verifyPassword(newUserData.password, currentUser.password)
    if (!isPasswordCorrect) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED)
    }
    const updatedUser = Object.assign(currentUser, newUserData)
    if (newUserData.newPassword) {
      updatedUser.password = await this.createPassword(newUserData.newPassword)
      delete updatedUser.newPassword
      await client.users.update({ where: { id }, data: updatedUser })
    }
    delete updatedUser.newPassword
    delete updatedUser.password
    await client.users.update({ where: { id }, data: updatedUser })
    return updatedUser
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
    const user = await client.users.findFirst({ where: { token: refreshToken }, select: { id: true, username: true, cardNumber: true, balance: true, phoneNumber: true, CVV: true } })
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
      throw new HttpException('Login, please', HttpStatus.UNAUTHORIZED)
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

  buildUserResponseForManyUsers(users: Users[]): Users[] {
    return users.map(user => {
      delete user.createdAt
      delete user.password
      delete user.token
      delete user.CVV
      return user
    })
  }

  generateSequentialNumber(countOfNumbers: number): number {
    var randomNumber = ''

    for (var i = 0; i < countOfNumbers; i++) {
      var digit = Math.floor(Math.random() * 10)
      randomNumber += digit
    }

    return +randomNumber
  }

  correctFullName(fullname: string): string {
    if (fullname.includes(' ')) {
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
    } else {
      let result = ''
      let chars = fullname.split('')
      result += chars[ 0 ].toUpperCase() + fullname.slice(1)
      return result
    }
  }

}