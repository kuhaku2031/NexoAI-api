import { Injectable } from '@nestjs/common';
import { CreatePaymentsDetailDto } from './dto/create-payments-detail.dto';
import { PaymentsDetail } from './entities/payments-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PaymentsDetailsService {
  constructor(
    @InjectRepository(PaymentsDetail)
    private readonly paymentDetailRepository: Repository<PaymentsDetail>,
  ) {}
  async createPaymentDeatils(
    createPaymentsDetailDto: CreatePaymentsDetailDto[],
    transactionalEntityManager?: EntityManager,
  ) {
    if (!transactionalEntityManager) {
      const paymentDetails = this.paymentDetailRepository.create(
        createPaymentsDetailDto,
      );
      return await this.paymentDetailRepository.save(paymentDetails);
    }

    const paymentDetails = createPaymentsDetailDto.map((dto) =>
      this.paymentDetailRepository.create(dto),
    );
    await transactionalEntityManager.save(paymentDetails);
    return paymentDetails;
  }
}
