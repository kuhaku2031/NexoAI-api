import { PartialType } from '@nestjs/mapped-types';
import { CreatePointSaleDto } from './create-point-sale.dto';

export class UpdatePointSaleDto extends PartialType(CreatePointSaleDto) {}
