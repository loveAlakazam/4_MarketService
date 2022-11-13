import { Injectable } from '@nestjs/common';
import { NotFoundSellerException } from '../users/users.exception';
import { UsersRepository } from '../users/users.repository';
import { MarketsRepository } from '../markets/markets.repository';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  NoAuthProductException,
  NotFoundProductException,
} from './products.exception';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  // ProductsRepository 주입
  constructor(
    private readonly repository: ProductsRepository,
    private readonly marketRepository: MarketsRepository,
  ) {}

  async create(user: UserDocument, createProductDto: CreateProductDto) {
    try {
      // 상품을 등록한다.
      const newProduct = await this.repository.createProduct(
        user,
        createProductDto,
      );

      // 마켓에서 상품을 등록한다.
      await this.marketRepository.createMarketData(user, newProduct);

      //새로운 상품정보를 리턴
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  private async checkSeller(user: UserDocument, productId: string) {
    // 상품을 등록한 셀러아이디를 구한다.
    const product = await this.repository.findProductById(productId);

    // 상품이 존재하지 않다면 예외를 발생시킨다.
    if (!product) {
      throw new NotFoundProductException();
    }

    // 문자열로 변환시킨다.
    const sellerId = product.user;
    const sellerIdStr = sellerId.toString();
    const userIdStr = user._id.toString();

    // 로그인한 유저와 다른 셀러면 예외를 발생시킨다.
    if (sellerIdStr !== userIdStr) {
      throw new NoAuthProductException();
    }
    return;
  }

  async update(
    user: UserDocument,
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      // 로그인한 유저가 상품의 셀러와 동일한지 확인
      await this.checkSeller(user, productId);

      // 수정
      return await this.repository.updateProduct(productId, updateProductDto);
    } catch (error) {
      throw error;
    }
  }

  async remove(user: UserDocument, productId: string) {
    try {
      // 로그인한 유저가 상품의 셀러와 동일한지 확인
      await this.checkSeller(user, productId);

      // 삭제(soft-delete)
      await this.repository.deleteProduct(productId);

      // 마켓데이터도 삭제한다.
      await this.marketRepository.deleteMarketData(user, productId);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    // 모든 상품들을 리턴한다.
    return await this.repository.findAllProducts();
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }
}
