import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'customText', async: false })
export class IsFullName implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    let regName = /^[a-zA-Z]+ [a-zA-Z]+$/
    if (!regName.test(text)) {
      return false
    } else {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Enter correct fullname'
  }
}