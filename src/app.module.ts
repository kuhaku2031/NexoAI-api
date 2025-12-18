import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import all modules here
import { BussinesModule } from './business/bussines.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { BillingModule } from './core/billing/billing.module';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';

//  Import all entities here
import { Category } from './business/inventory/categories/entities/category.entity';
import { Product } from './business/inventory/products/entities/product.entity';
import { PointSale } from './business/pos/point-sale/entities/point-sale.entity';
import { Payment } from './business/payment/payments/entities/payment.entity';
import { PaymentsDetail } from './business/payment/payments-details/entities/payments-detail.entity';
import { PaymentsMethod } from './business/payment/payments-methods/entities/payments-method.entity';
import { Sale } from './business/sale/sales/entities/sale.entity';
import { SalesDetail } from './business/sale/sales-details/entities/sales-detail.entity';
import { Company } from './core/companies/entities/company.entity';
import { Users } from './core/users/entities/user.entity';
import { Subscription } from './core/billing/suscription/entities/suscription.entity';
import { SubscriptionPlan } from './core/billing/suscription-plans/entities/suscription-plan.entity';
import { SubscriptionUsage } from './core/billing/suscription-usage/entities/suscription-usage.entity';
import { ConfigModule } from '@nestjs/config';
import { WorkSession } from './business/work-sessions/entities/work-session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        // BUSSINES
        // {inventory}
        Category,
        Product,

        // {payment}
        Payment,
        PaymentsDetail,
        PaymentsMethod,

        // {pos}
        PointSale,

        // {sale}
        Sale,
        SalesDetail,

        // {work-sessions}
        WorkSession,

        // CORE
        // {billing}
        Subscription,
        SubscriptionPlan,
        SubscriptionUsage,

        // {companies}
        Company,

        // {users}
        Users,
      ],
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Add all modules here

    AiModule,
    AnalyticsModule,
    BussinesModule,
    CommonModule,
    CoreModule,
    BillingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
