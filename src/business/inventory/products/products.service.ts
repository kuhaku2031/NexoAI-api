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
import { FilterProductDto } from './dto/filter-product.dto';
import { StatusStock } from 'src/common/enum/product';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

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

  async findAllWithFilters(filterProductDto: FilterProductDto): Promise<PaginatedResponse<Product>> {
        const { 
      page = 1,
      limit = 20,
      search,
      categories,
      min_price,
      max_price,
      stock_status,
      sort_by = 'name',
      sort_order = 'ASC',
    } = filterProductDto;

    const queryBuilder = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category');

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.code::text ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (categories && categories.length > 0) {
      queryBuilder.andWhere('category.category_name IN (:...categories)', {categories})
  }
    if (min_price !== undefined) {
      queryBuilder.andWhere('product.selling_price >= :minPrice', { min_price });
    }

    if (max_price !== undefined) {
      queryBuilder.andWhere('product.selling_price <= :maxPrice', { max_price });
    }

    if (stock_status) {
      switch (stock_status) {
        case StatusStock.IN_STOCK:
          queryBuilder.andWhere('product.stock > 10');
          break;
        case StatusStock.LOW_STOCK:
          queryBuilder.andWhere('product.stock BETWEEN 1 AND 10');
          break;
        case StatusStock.OUT_OF_STOCK:
          queryBuilder.andWhere('product.stock = 0');
          break;
      }
    }

    queryBuilder.orderBy(`product.${sort_by}`, sort_order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total: total,
        page: page,
        limit: limit,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    };
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
