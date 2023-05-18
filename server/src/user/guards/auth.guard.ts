import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = request.headers.authorization
    try {
      const JwtData = verify(token, process.env.SECRET)
      request.body.user = JwtData
    } catch (error) {
      throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED)
    }
    return true
  }
}
