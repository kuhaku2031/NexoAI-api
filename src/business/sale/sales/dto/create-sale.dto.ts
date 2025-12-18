import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateDateColumn } from 'typeorm';
import { CreateSalesDetailDto } from '../../sales-details/dto/create-sales-detail.dto';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  payment_method: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999999999999)
  @IsNotEmpty()
  discount: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @IsNotEmpty()
  total_amount: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  point_sale: string;

  @CreateDateColumn()
  sale_date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesDetailDto)
  product: CreateSalesDetailDto[];
}
