import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    // 상품 다큐먼트 주입
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAllProducts(): Promise<Product[]> {
    const productList = await this.productModel.find().exec();
    return productList;
  }
}
