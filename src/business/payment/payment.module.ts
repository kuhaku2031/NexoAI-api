import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsMethodsModule } from './payments-methods/payments-methods.module';
import { PaymentsDetailsModule } from './payments-details/payments-details.module';

@Module({
  imports: [PaymentsModule, PaymentsMethodsModule, PaymentsDetailsModule],
  providers: [],
  exports: [],
})
export class PaymentModule {}
