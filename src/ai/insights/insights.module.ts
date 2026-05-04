import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';
import { GenerateInsightsJob } from './jobs/generate-insights.job';
import { Company } from 'src/core/companies/entities/company.entity';
import { Product } from 'src/business/inventory/products/entities/product.entity';
import { Sale } from 'src/business/sale/sales/entities/sale.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Product, Sale]),
  ],
  controllers: [InsightsController],
  providers: [InsightsService, GenerateInsightsJob],
})
export class InsightsModule {}
