import { IsNotEmpty, IsPhoneNumber } from "class-validator"

export class UpdateUserData {
  @IsPhoneNumber()
  phoneNumber?: string
  CVV?: string
  newPassword?: string
  @IsNotEmpty()
  password: string
}