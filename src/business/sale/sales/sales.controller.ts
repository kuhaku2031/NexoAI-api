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
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @Roles(UserRole.EMPLOYEE)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Post()
  // @Roles(UserRole.EMPLOYEE)
  async create(@Body() createSaleWithPaymentDto: CreateSaleWithPaymentDto) {
    return this.salesService.createSale(createSaleWithPaymentDto);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER)
  update(@Param('id') id: string) {
    return this.salesService.update(+id);
  }
  @Delete(':id')
  @Roles(UserRole.MANAGER)
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
