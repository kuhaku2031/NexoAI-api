import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsDetailsService } from './payments-details.service';
import { CreatePaymentsDetailDto } from './dto/create-payments-detail.dto';

@Controller('payments-details')
export class PaymentsDetailsController {
  constructor(
    private readonly paymentsDetailsService: PaymentsDetailsService,
  ) {}

  @Post()
  async createPaymentDetails(
    @Body() createPaymentsDetailDto: CreatePaymentsDetailDto[],
  ) {
    return await this.paymentsDetailsService.createPaymentDeatils(
      createPaymentsDetailDto,
    );
  }
}
