import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { CreateFirestoreDto } from './dto/create-firestore.dto';
import { UpdateFirestoreDto } from './dto/update-firestore.dto';

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Post()
  create(@Body() createFirestoreDto: CreateFirestoreDto) {
    return this.firestoreService.create(createFirestoreDto);
  }

  @Get()
  findAll() {
    return this.firestoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firestoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFirestoreDto: UpdateFirestoreDto) {
    return this.firestoreService.update(+id, updateFirestoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.firestoreService.remove(+id);
  }
}
