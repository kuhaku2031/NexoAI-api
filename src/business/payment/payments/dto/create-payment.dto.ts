import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreatePaymentsDetailDto } from 'src/business/payment/payments-details/dto/create-payments-detail.dto';
import { CreateDateColumn } from 'typeorm';

export class CreatePaymentDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @IsNotEmpty()
  total_amount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentsDetailDto)
  paymentDetail: CreatePaymentsDetailDto[];

  @CreateDateColumn()
  payment_date: Date;
}
