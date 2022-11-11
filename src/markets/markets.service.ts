import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { MarketsRepository } from './markets.repository';

@Injectable()
export class MarketsService {
  constructor(
    private readonly repository: MarketsRepository,
    private readonly productRepository: ProductsRepository,
  ) {}
  create(createMarketDto: CreateMarketDto) {
    return 'This action adds a new market';
  }

  findAll() {
    return `This action returns all markets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} market`;
  }

  update(id: number, updateMarketDto: UpdateMarketDto) {
    return `This action updates a #${id} market`;
  }

  remove(id: number) {
    return `This action removes a #${id} market`;
  }
}
