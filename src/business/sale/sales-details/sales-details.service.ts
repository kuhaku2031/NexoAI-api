import { Injectable } from '@nestjs/common';
import { CreateSalesDetailDto } from './dto/create-sales-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesDetail } from './entities/sales-detail.entity';
import { EntityManager, Repository } from 'typeorm';
import { Product } from 'src/business/inventory/products/entities/product.entity';

@Injectable()
export class SalesDetailsService {
  constructor(
    @InjectRepository(SalesDetail)
    private readonly salesDetailsRepository: Repository<SalesDetail>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async createSaleDetail(
    createSalesDetailDtos: CreateSalesDetailDto[],
    transactionalEntityManager: EntityManager,
  ) {
    for (const dto of createSalesDetailDtos) {
      const productExists = await this.productRepository.findOne({
        where: { code: dto.code },
      });
      if (!productExists) {
        throw new Error(`Product with code ${dto.code} does not exist`);
      }
    }

    const salesDetails = createSalesDetailDtos.map((dto) =>
      this.salesDetailsRepository.create(dto),
    );
    await transactionalEntityManager.save(salesDetails);
    return salesDetails;
  }

  findAll() {
    return this.salesDetailsRepository.find();
  }

  async getSalesDetail(conditions: any): Promise<SalesDetail[]> {
    return await this.salesDetailsRepository.find(conditions);
  }

  // update(id: number, updateSalesDetailDto: UpdateSalesDetailDto) {
  //   return `This action updates a #${id} salesDetail`;
  // }

  async removeSaleDetail(saleDetails: any) {
    return await this.salesDetailsRepository.remove(saleDetails);
  }
}
