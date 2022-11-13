import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Market, MarketDocument } from './schemas/markets.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import { AccessUser } from 'src/auth/dto/access-user.dto';

@Injectable()
export class MarketsRepository {
  constructor(
    // 마켓 다큐먼트 주입
    @InjectModel(Market.name)
    private readonly marketModel: Model<MarketDocument>,
  ) {}

  async createMarketData(seller: AccessUser, product: Product) {
    const newMarketData = await new this.marketModel({
      seller: seller._id,
      product: product,
    });

    await newMarketData.save();
  }

  async deleteMarketData(seller: AccessUser, productId: string) {
    await this.marketModel
      .updateOne(
        { product: productId, seller: seller._id },
        { deletedAt: Date.now() },
      )
      .exec();
  }
}
