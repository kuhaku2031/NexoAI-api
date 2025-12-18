import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsDetailsModule } from 'src/business/payment/payments-details/payments-details.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), PaymentsDetailsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [TypeOrmModule],
})
export class PaymentsModule {}
