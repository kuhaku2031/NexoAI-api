import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PointSaleService } from './point-sale.service';
import { CreatePointSaleDto } from './dto/create-point-sale.dto';
import { UpdatePointSaleDto } from './dto/update-point-sale.dto';

@Controller('point-sale')
export class PointSaleController {
  constructor(private readonly pointSaleService: PointSaleService) {}

  @Post()
  create(@Body() createPointSaleDto: CreatePointSaleDto) {
    return this.pointSaleService.create(createPointSaleDto);
  }

  @Get()
  findAll() {
    return this.pointSaleService.findAll();
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePointSaleDto: UpdatePointSaleDto,
  ) {
    return this.pointSaleService.update(+id, updatePointSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointSaleService.remove(+id);
  }
}
