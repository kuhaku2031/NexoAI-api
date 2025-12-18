import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentsDetailDto } from './create-payments-detail.dto';

export class UpdatePaymentsDetailDto extends PartialType(
  CreatePaymentsDetailDto,
) {}
