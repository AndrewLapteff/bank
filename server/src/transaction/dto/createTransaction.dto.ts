import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class TransactionDto {
  @IsNotEmpty()
  @IsNumber()
  readonly receiverId: number
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly amount: number
  @IsString()
  readonly message: string
}