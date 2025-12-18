import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesDetailDto } from './create-sales-detail.dto';

export class UpdateSalesDetailDto extends PartialType(CreateSalesDetailDto) {}
