import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { AccessUser } from '../auth/dto/access-user.dto';
import { ProductInfo, ProductWithoutUserInfo } from './dto/product-info.dto';
import {
  ProductDetailInfoDto,
  ProductSellerInfo,
} from './dto/product-detail-info.dto';

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
      .populate('user', [
        '_id',
        'name',
        'email',
        'phoneNumber',
        'isSeller',
        'sellerNickname',
      ])
      .exec();

    return productList;
  }

  async findOnePopulated(productId: string): Promise<ProductDetailInfoDto> {
    const productOne = await this.productModel
      .findOne({ _id: productId, deletedAt: null })
      .populate('user', [
        '_id',
        'name',
        'email',
        'phoneNumber',
        'isSeller',
        'sellerNickname',
      ])
      .exec();

    const {
      user,
      _id,
      name,
      buyCountry,
      buyLocation,
      category,
      price,
      description,
      closeDate,
      createdAt,
    } = productOne;

    const seller: ProductSellerInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isSeller: user.isSeller,
      sellerNickname: user.sellerNickname,
    };

    const info: ProductWithoutUserInfo = {
      _id: _id,
      name: name,
      buyCountry: buyCountry,
      buyLocation: buyLocation,
      category: category,
      price: price,
      description: description,
      closeDate: closeDate,
      createdAt: createdAt,
    };

    return { info: info, seller: seller };
  }

  async findSellerOtherProducts(
    sellerId: string,
    productId: string,
  ): Promise<ProductInfo[]> {
    const query = this.productModel.find({
      deletedAt: null, // 삭제가 안된 상태
      user: sellerId, // 셀러 아이디
      _id: { $nin: [productId] }, // 조회아이디(productId) 외 셀러가 올린 다른 상품
      $cond: {
        if: { $exists: { closeDate: { $neq: null } } }, // 주문마감일이 존재한다면
        then: { closeDate: { $gte: new Date() } }, // 오늘보다 미래인지 체크
        else: null,
      },
    });

    const otherProducts = await query;

    return otherProducts;
  }
}
