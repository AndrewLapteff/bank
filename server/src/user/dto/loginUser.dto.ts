import { IsNotEmpty, IsPhoneNumber } from "class-validator"

export class LoginUserDto {
  @IsPhoneNumber()
  readonly phoneNumber: string
  @IsNotEmpty()
  readonly password: string
}