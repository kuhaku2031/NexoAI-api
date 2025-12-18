import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { PointSaleModule } from 'src/business/pos/point-sale/point-sale.module';
import { PaymentsModule } from 'src/business/payment/payments/payments.module';
import { PaymentsDetailsModule } from 'src/business/payment/payments-details/payments-details.module';
import { SalesDetailsModule } from '../sales-details/sales-details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    SalesDetailsModule,
    PointSaleModule,
    PaymentsModule,
    PaymentsDetailsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
