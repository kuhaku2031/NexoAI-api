import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Import all modules here
import { BussinesModule } from './business/bussines.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { BillingModule } from './core/billing/billing.module';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { FirestoreModule } from './ai/firestore/firestore.module';
import { EmbeddingsModule } from './ai/embeddings/embeddings.module';
import { ConfigModule } from '@nestjs/config';

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
import { WorkSession } from './business/work-sessions/entities/work-session.entity';
import { ConversationEmbedding } from './ai/embeddings/entities/conversation-embedding.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      url: process.env.DB_URL,
      extra: {
        sslmode: 'require',
        connect_timeout: 10000,
      },
      type: (process.env.DB_TYPE as any) || 'postgres',
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

        // {companies}
        Company,

        // {users}
        Users,

        // AI
        // {embeddings}
        ConversationEmbedding,
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
    IntegrationsModule,
    FirestoreModule,
    EmbeddingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
