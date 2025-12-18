import { Module } from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { PaymentsMethodsController } from './payments-methods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsMethod } from './entities/payments-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsMethod])],
  controllers: [PaymentsMethodsController],
  providers: [PaymentsMethodsService],
  exports: [PaymentsMethodsService],
})
export class PaymentsMethodsModule {}
