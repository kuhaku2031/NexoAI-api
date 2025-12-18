import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sale/sales/sales.module';
import { PaymentModule } from './payment/payment.module';
import { PosModule } from './pos/pos.module';
import { CustomersModule } from './customers/customers.module';
import { WorkSessionsModule } from './work-sessions/work-sessions.module';

@Module({
  imports: [
    InventoryModule,
    SalesModule,
    PaymentModule,
    PosModule,
    CustomersModule,
    WorkSessionsModule,
  ],
  exports: [
    InventoryModule,
    SalesModule,
    PaymentModule,
    PosModule,
    CustomersModule,
    WorkSessionsModule,
  ],
})
export class BussinesModule {}
