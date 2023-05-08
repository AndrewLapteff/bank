import { IsNotEmpty, IsPhoneNumber, Validate } from "class-validator"
import { IsFullName } from "../validators/IsFullname"
import { IsPhoneNumberUnique } from "../validators/IsPhoneNumberUnique"

export class CreateUserDto {
  @IsNotEmpty()
  @Validate(IsFullName)
  readonly username: string

  @IsNotEmpty()
  @IsPhoneNumber()
  @Validate(IsPhoneNumberUnique)
  readonly phoneNumber: string

  @IsNotEmpty()
  readonly password: string
  readonly balance: Date
}