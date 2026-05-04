import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/core/companies/entities/company.entity';
import { Product } from 'src/business/inventory/products/entities/product.entity';
import { Sale } from 'src/business/sale/sales/entities/sale.entity';

@Injectable()
export class GenerateInsightsJob {
  private readonly logger = new Logger(GenerateInsightsJob.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleDailyInsights() {
    this.logger.log('Iniciando job de generación de insights...');

    try {
      const companies = await this.companyRepository.find();

      for (const company of companies) {
        await this.generateInsightsForCompany(company.company_id);
      }

      this.logger.log(`Insights generados para ${companies.length} empresas`);
    } catch (error) {
      this.logger.error(`Error en job de insights: ${error}`);
    }
  }

  private async generateInsightsForCompany(companyId: string) {
    const lowStockProducts = await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock < :threshold', { threshold: 10 })
      .andWhere('product.stock > 0')
      .setParameter('companyId', companyId)
      .getMany();

    if (lowStockProducts.length > 0) {
      this.logger.log(
        `Empresa ${companyId}: ${lowStockProducts.length} productos con stock bajo`,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.sale_date >= :date', { date: today })
      .andWhere('sale.company_id = :companyId', { companyId })
      .getCount();

    this.logger.log(`Empresa ${companyId}: ${todaySales} ventas hoy`);

    return {
      lowStockCount: lowStockProducts.length,
      todaySales,
    };
  }
}