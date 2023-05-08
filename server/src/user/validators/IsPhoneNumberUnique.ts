import { PrismaClient } from '@prisma/client'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'customText', async: false })
export class IsPhoneNumberUnique implements ValidatorConstraintInterface {
  async validate(number: string, args: ValidationArguments) {
    const client = new PrismaClient()
    const user = await client.users.findUnique({ where: { phoneNumber: number } })
    if (user) {
      return false
    } else {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'This phone number already in use'
  }
}