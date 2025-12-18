import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(10000000)
  @Max(9999999999999)
  @IsNotEmpty()
  code: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @IsNotEmpty()
  purchase_price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @IsNotEmpty()
  selling_price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  category: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  stock: number;
}
