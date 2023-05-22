import { IsNotEmpty, IsPhoneNumber, Validate } from "class-validator"
import { IsFullName } from "../validators/IsFullname"
import { IsPhoneNumberUnique } from "../validators/IsPhoneNumberUnique"
import { IsCVV } from "../validators/IsCVV"

export class CreateUserDto {
  @IsNotEmpty()
  @Validate(IsFullName)
  readonly username: string

  @IsNotEmpty()
  @IsPhoneNumber()
  @Validate(IsPhoneNumberUnique)
  readonly phoneNumber: string

  @IsNotEmpty()
  @Validate(IsCVV)
  readonly CVV: number

  @IsNotEmpty()
  readonly password: string
  readonly balance: Date
}