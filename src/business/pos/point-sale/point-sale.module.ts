import { Module } from '@nestjs/common';
import { PointSaleService } from './point-sale.service';
import { PointSaleController } from './point-sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointSale } from './entities/point-sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointSale])],
  controllers: [PointSaleController],
  providers: [PointSaleService],
  exports: [PointSaleService],
})
export class PointSaleModule {}
