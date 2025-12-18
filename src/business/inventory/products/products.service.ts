import { SearchProductDto } from './dto/search-product.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { Category } from 'src/business/inventory/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      category_name: createProductDto.category,
    });

    if (!category) {
      throw new Error(`Category ${createProductDto.category} not found`);
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      category,
    });

    try {
      return await this.productRepository.save(newProduct);
    } catch (error) {
      if (error.message.includes('Product with code')) {
        throw new ConflictException(
          'El código del producto ya existe. Por favor, elige un código diferente.',
        );
      }
      // Manejar otros errores
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      );
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async searchProduct(SearchProductDto: SearchProductDto): Promise<Product[]> {
    const { searchTerm } = SearchProductDto;

    const products = await this.productRepository.find({
      where: [{ name: Like(`%${searchTerm}%`) }],
    });

    return products;
  }
  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
