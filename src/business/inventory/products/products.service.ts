import { SearchProductDto } from './dto/search-product.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { category_name: createProductDto.category },
      });

      if (!category) {
        throw new NotFoundException(
          `Category ${createProductDto.category} not found`,
        );
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        category: category, // 👈 Pasa la entidad completa
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      if (error.code === '23505') {
        // Código de PostgreSQL para unique violation
        throw new ConflictException(
          'El código del producto ya existe. Por favor, elige un código diferente.',
        );
      }
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async searchProduct(SearchProductDto: SearchProductDto) {
    const { search_term } = SearchProductDto;

    const products = await this.productRepository.find({
      where: [{ name: Like(`%${search_term}%`) }],
    });

    return products;
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return this.productRepository.update(id, updateProductDto);
  // }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
