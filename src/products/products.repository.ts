import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Market, MarketDocument } from '../markets/schemas/markets.schema';
import { User } from '../users/schemas/user.schema';
import { AccessUser } from 'src/auth/dto/access-user.dto';
import { ProductInfo } from './dto/product-info.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    // 상품 다큐먼트 주입
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(
    user: AccessUser,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
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

  async findProductById(productId: string): Promise<ProductInfo> {
    const _product = await this.productModel.findOne({
      _id: productId,
      deletedAt: null,
    });

    // 검색조건에 부합하는 데이터가 존재
    if (_product) {
      const product: ProductInfo = {
        _id: _product._id,
        user: _product.user,
        name: _product.name,
        buyCountry: _product.buyCountry,
        buyLocation: _product.buyLocation,
        category: _product.category,
        price: _product.price,
        description: _product.description,
        closeDate: _product.closeDate,
        createdAt: _product.createdAt,
      };

      return product;
    }

    return _product;
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
