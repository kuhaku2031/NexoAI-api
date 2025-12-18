import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { CreateSaleWithPaymentDto } from './dto/create-sale-with-payment.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(
    @Body() createSaleWithPaymentDto: CreateSaleWithPaymentDto,
  ): Promise<Sale> {
    return this.salesService.createSale(createSaleWithPaymentDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
