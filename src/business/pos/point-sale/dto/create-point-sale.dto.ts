import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePointSaleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  address: string;
}
