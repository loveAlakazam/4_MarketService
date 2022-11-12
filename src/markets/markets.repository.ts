import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Market, MarketDocument } from './schemas/markets.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MarketsRepository {
  constructor(
    // 마켓 다큐먼트 주입
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,

    // 상품 다큐먼트 주입
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,

    // 유저 다큐먼트 주입
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // 래포지토리 함수
}
