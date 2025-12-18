import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateSalesDetailDto {
  @Type(() => Number)
  @IsNumber()
  @Min(10000000)
  @Max(9999999999999)
  @IsNotEmpty()
  code: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @IsNotEmpty()
  selling_price: number;

  @IsNotEmpty()
  product: any;
}
