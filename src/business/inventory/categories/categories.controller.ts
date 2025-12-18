import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':category_name')
  findOne(@Param('category_name') category_name: string) {
    return this.categoriesService.findByName(category_name);
  }

  @Patch(':category_name')
  update(
    @Param('category_name') category_name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(category_name, updateCategoryDto);
  }

  @Delete(':category_name')
  remove(@Param('category_name') category_name: string) {
    return this.categoriesService.remove(category_name);
  }
}
