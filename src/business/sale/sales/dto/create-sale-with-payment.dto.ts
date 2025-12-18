import { CreatePaymentDto } from 'src/business/payment/payments/dto/create-payment.dto';
import { CreateSaleDto } from './create-sale.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateSaleWithPaymentDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSaleDto)
  saleData: CreateSaleDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePaymentDto)
  paymentData: CreatePaymentDto;
}
