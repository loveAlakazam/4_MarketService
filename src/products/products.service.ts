import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  // ProductsRepository 주입
  constructor(private readonly repository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    // 상품을 등록한다.
    return await this.repository.createProduct(createProductDto);
  }

  async findAll() {
    // 모든 상품들을 리턴한다.
    return await this.repository.findAllProducts();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
