import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePaymentsMethodDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  payment_method: string;
}
