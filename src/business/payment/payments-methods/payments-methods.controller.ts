import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentsMethodsService } from './payments-methods.service';
import { CreatePaymentsMethodDto } from './dto/create-payments-method.dto';
import { UpdatePaymentsMethodDto } from './dto/update-payments-method.dto';

@Controller('payments-methods')
export class PaymentsMethodsController {
  constructor(
    private readonly paymentsMethodsService: PaymentsMethodsService,
  ) {}

  @Post()
  create(@Body() createPaymentsMethodDto: CreatePaymentsMethodDto) {
    return this.paymentsMethodsService.create(createPaymentsMethodDto);
  }

  @Get()
  findAll() {
    return this.paymentsMethodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsMethodsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentsMethodDto: UpdatePaymentsMethodDto,
  ) {
    return this.paymentsMethodsService.update(+id, updatePaymentsMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsMethodsService.remove(+id);
  }
}
