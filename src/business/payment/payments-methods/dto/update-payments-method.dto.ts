import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentsMethodDto } from './create-payments-method.dto';

export class UpdatePaymentsMethodDto extends PartialType(
  CreatePaymentsMethodDto,
) {}
