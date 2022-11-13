import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Market, MarketDocument } from '../markets/schemas/markets.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    // 상품 다큐먼트 주입
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(user: UserDocument, createProductDto: CreateProductDto) {
    const newProduct = await this.productModel.create({
      ...createProductDto,
      user: user._id,
    });

    return newProduct;
  }

  async deleteProduct(productId: string) {
    await this.productModel.updateOne(
      { _id: productId },
      { deletedAt: Date.now() },
    );
  }

  async findProductById(productId: string) {
    return await this.productModel.findOne({ _id: productId, deletedAt: null });
  }

  async findSellerIdByProductId(productId: string) {
    const sellerId = await this.productModel.findById(productId);
    return sellerId?.user;
  }

  async updateProduct(productId: string, updateProductDto) {
    await this.productModel.updateOne(
      { _id: productId },
      { ...updateProductDto },
    );
  }

  async findAllProducts() {
    const productList = await this.productModel
      .find({ deletedAt: null })
      .exec();
    return productList;
  }
}
