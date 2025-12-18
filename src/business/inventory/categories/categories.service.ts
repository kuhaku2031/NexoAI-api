import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) // Injecting the Category Entity Repository into the service constructor.
    private readonly categoriesRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findAll() {
    return "This action returns all categories";
  }

  async findByName(category_name: string): Promise<Category> {
    return this.categoriesRepository.findOneBy({ category_name });
  }

  async update(category_name: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({
      category_name,
    });
    if (!category) {
      throw new Error(`Category with name ${category_name} not found`);
    }

    return await this.categoriesRepository.update(
      category.id,
      updateCategoryDto,
    );
  }

  async remove(category_name: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({
      category_name,
    });
    if (!category) {
      throw new Error(`Category with name ${category_name} not found`);
    }

    return await this.categoriesRepository.remove(category);
  }
}
