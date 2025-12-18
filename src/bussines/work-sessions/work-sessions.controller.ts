import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkSessionsService } from './work-sessions.service';
import { CreateWorkSessionDto } from './dto/create-work-session.dto';
import { UpdateWorkSessionDto } from './dto/update-work-session.dto';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Controller('work-sessions')
export class WorkSessionsController {
  constructor(private readonly workSessionsService: WorkSessionsService) {}

  @Post('crear')
  create(@Body() createWorkSessionDto: CreateWorkSessionDto) {
    return this.workSessionsService.create(createWorkSessionDto);
  }

  @Get()
  findAll() {
    return this.workSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkSessionDto: UpdateWorkSessionDto,
  ) {
    return this.workSessionsService.update(+id, updateWorkSessionDto);
  }

  @Post('check-in')
  checkIn(@Body() checkInDto: CheckInDto) {
    return this.workSessionsService.checkIn(checkInDto);
  }

  @Post('check-out')
  checkOut(@Body() checkOutDto: CheckOutDto) {
    return this.workSessionsService.checkOut(checkOutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workSessionsService.remove(+id);
  }
}
