import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'customText', async: false })
export class IsCVV implements ValidatorConstraintInterface {
  validate(CVV: number, args: ValidationArguments) {
    if (CVV > 999 || CVV < 100) {
      return false
    } else {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'CVV must be between 100 and 999'
  }
}