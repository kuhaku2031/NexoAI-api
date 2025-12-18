import { Module } from '@nestjs/common';
import { PointSaleModule } from './point-sale/point-sale.module';

@Module({
  imports: [PointSaleModule],
})
export class PosModule {}
