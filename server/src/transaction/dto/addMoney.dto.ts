import { IsNotEmpty, IsNumber, IsPositive } from "class-validator"

export class addMoneyDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number
}