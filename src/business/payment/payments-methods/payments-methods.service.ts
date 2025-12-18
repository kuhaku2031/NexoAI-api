import { Injectable } from '@nestjs/common';
import { CreatePaymentsMethodDto } from './dto/create-payments-method.dto';
import { UpdatePaymentsMethodDto } from './dto/update-payments-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsMethod } from './entities/payments-method.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsMethodsService {
  constructor(
    @InjectRepository(PaymentsMethod)
    private readonly paymentMethodRepository: Repository<PaymentsMethod>,
  ) {}

  create(createPaymentsMethodDto: CreatePaymentsMethodDto) {
    const paymentMethod = this.paymentMethodRepository.create(
      createPaymentsMethodDto,
    );
    return this.paymentMethodRepository.save(paymentMethod);
  }

  findAll() {
    return this.paymentMethodRepository.find();
  }

  findOne(id: number) {
    return this.paymentMethodRepository.findOne({ where: { id } });
  }

  update(id: number, updatePaymentsMethodDto: UpdatePaymentsMethodDto) {
    return this.paymentMethodRepository.update(id, updatePaymentsMethodDto);
  }

  remove(id: number) {
    return this.paymentMethodRepository.delete(id);
  }
}
