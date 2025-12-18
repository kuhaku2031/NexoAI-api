import { Module } from '@nestjs/common';
import { PaymentsDetailsService } from './payments-details.service';
import { PaymentsDetailsController } from './payments-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsDetail } from './entities/payments-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsDetail])],
  controllers: [PaymentsDetailsController],
  providers: [PaymentsDetailsService],
  exports: [PaymentsDetailsService],
})
export class PaymentsDetailsModule {}
