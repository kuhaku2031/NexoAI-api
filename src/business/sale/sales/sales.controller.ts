import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleWithPaymentDto } from './dto/create-sale-with-payment.dto';
import { UserRole } from 'src/common/enum/role.enum';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @Auth(UserRole.EMPLOYEE)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Auth(UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Post()
  @Auth(UserRole.EMPLOYEE)
  async create(@Body() createSaleWithPaymentDto: CreateSaleWithPaymentDto) {
    return this.salesService.createSale(createSaleWithPaymentDto);
  }

  @Patch(':id')
  @Auth(UserRole.MANAGER)
  update(@Param('id') id: string) {
    return this.salesService.update(+id);
  }
  @Delete(':id')
  @Auth(UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
