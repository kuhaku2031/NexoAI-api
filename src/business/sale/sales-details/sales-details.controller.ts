import { Controller, Get } from '@nestjs/common';
import { SalesDetailsService } from './sales-details.service';
// import { UpdateSalesDetailDto } from './dto/update-sales-detail.dto';

@Controller('sales-details')
export class SalesDetailsController {
  constructor(private readonly salesDetailsService: SalesDetailsService) {}

  @Get()
  findAll() {
    return this.salesDetailsService.findAll();
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSalesDetailDto: UpdateSalesDetailDto) {
  //   return this.salesDetailsService.update(+id, updateSalesDetailDto);
  // }
}
