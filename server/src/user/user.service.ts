import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { CreateUserDto } from './dto/createUser.dto'
import { hash, compare } from 'bcrypt'
import { LoginUserDto } from './dto/loginUser.dto'
import { sign } from 'jsonwebtoken'
import { UserType } from './types/userType'
import { client } from '../main'

@Injectable()
export class UserService {
  async createUser(user: CreateUserDto): Promise<UserType> {
    const newUser: UserType = await client.users.create({
      data: {
        username: this.correctFullName(user.username),
        phoneNumber: user.phoneNumber,
        password: await this.createPassword(user.password),
        balance: 0,
        createdAt: new Date()
      }
    })
    return newUser
  }

  async login(userCredentials: LoginUserDto): Promise<UserType> {
    const currentUser: UserType = await client.users.findFirst({ where: { phoneNumber: userCredentials.phoneNumber } })
    if (!currentUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const isPasswordCorrect = await this.verifyPassword(userCredentials.password, currentUser.password)
    if (!isPasswordCorrect)
      throw new HttpException('Password incorrect', HttpStatus.FORBIDDEN)
    currentUser.token = await this.createJwtToken(currentUser)
    return currentUser
  }

  async getCurrentUser(id: number): Promise<UserType> {
    const currentUser: UserType = await client.users.findFirst({ where: { id } })
    currentUser.token = await this.createJwtToken(currentUser)
    return currentUser
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

  createPassword(password: string): Promise<string> {
    return hash(password, 10)
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }

  async createJwtToken(user: Users): Promise<string> {
    return sign({ id: user.id, phoneNumber: user.phoneNumber, password: user.password, }, process.env.SECRET)
  }

  buildUserResponse(user: Users): { user: UserType } {
    delete user.password
    delete user.createdAt
    return { user }
  }
}
