import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (request.body.user == null) {
      return null
    }
    if (data) {
      return request.body.user[ data ]
    }
    return request.body.user
  },
)