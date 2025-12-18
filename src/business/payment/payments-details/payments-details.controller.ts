import { Controller } from '@nestjs/common';
import { PaymentsDetailsService } from './payments-details.service';

@Controller('payments-details')
export class PaymentsDetailsController {
  constructor(
    private readonly paymentsDetailsService: PaymentsDetailsService,
  ) {}
}
