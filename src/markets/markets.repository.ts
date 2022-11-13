import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Market, MarketDocument } from './schemas/markets.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MarketsRepository {
  constructor(
    // 마켓 다큐먼트 주입
    @InjectModel(Market.name)
    private readonly marketModel: Model<MarketDocument>,
  ) {}

  async createMarketData(seller: UserDocument, product: ProductDocument) {
    const newMarketData = await new this.marketModel({
      seller: seller._id,
      product: product._id,
    });

    await newMarketData.save();
    return newMarketData;
  }

  async deleteMarketData(seller: UserDocument, productId: string) {
    await this.marketModel
      .updateOne(
        { product: productId, seller: seller._id },
        { deletedAt: Date.now() },
      )
      .exec();
  }
}
