import { Module } from '@nestjs/common';
import { SalesDetailsService } from './sales-details.service';
import { SalesDetailsController } from './sales-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesDetail } from './entities/sales-detail.entity';
import { ProductsModule } from 'src/business/inventory/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([SalesDetail]), ProductsModule],
  controllers: [SalesDetailsController],
  providers: [SalesDetailsService],
  exports: [SalesDetailsService],
})
export class SalesDetailsModule {}
