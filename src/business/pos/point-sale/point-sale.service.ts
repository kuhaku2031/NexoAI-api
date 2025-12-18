import { Injectable } from '@nestjs/common';
import { CreatePointSaleDto } from './dto/create-point-sale.dto';
import { UpdatePointSaleDto } from './dto/update-point-sale.dto';
import { PointSale } from './entities/point-sale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PointSaleService {
  constructor(
    @InjectRepository(PointSale)
    private readonly pointSaleRepository: Repository<PointSale>,
  ) {}

  async create(createPointSaleDto: CreatePointSaleDto) {
    const point = this.pointSaleRepository.create(createPointSaleDto);
    return await this.pointSaleRepository.save(point);
  }

  findAll() {
    return this.pointSaleRepository.find();
  }

  async findOnePointSale(name: string) {
    return this.pointSaleRepository.findOneBy({ name }); //
  }

  update(id: number, updatePointSaleDto: UpdatePointSaleDto) {
    return this.pointSaleRepository.update(id, updatePointSaleDto);
  }

  remove(id: number) {
    return this.pointSaleRepository.delete(id);
  }
}
