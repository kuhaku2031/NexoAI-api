import { Injectable } from '@nestjs/common';
import { CreatePaymentsMethodDto } from './dto/create-payments-method.dto';
import { UpdatePaymentsMethodDto } from './dto/update-payments-method.dto';

@Injectable()
export class PaymentsMethodsService {
  create(createPaymentsMethodDto: CreatePaymentsMethodDto) {
    return 'This action adds a new paymentsMethod';
  }

  findAll() {
    return `This action returns all paymentsMethods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentsMethod`;
  }

  update(id: number, updatePaymentsMethodDto: UpdatePaymentsMethodDto) {
    return `This action updates a #${id} paymentsMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentsMethod`;
  }
}
