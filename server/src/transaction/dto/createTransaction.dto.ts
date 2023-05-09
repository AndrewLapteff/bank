import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class TransactionDto {
  @IsNotEmpty()
  @IsNumber()
  cardNumber: number
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number
  @IsString()
  readonly message: string
}