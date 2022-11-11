import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

export type MarketDocument = Market & mongoose.Document;

@Schema()
export class Market {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sellerId: User; // 판매자 아이디

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: Product; // 상품 아이디
}

export const MarketSchema = SchemaFactory.createForClass(Market);
