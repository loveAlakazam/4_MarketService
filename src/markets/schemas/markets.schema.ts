import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../../products/schemas/product.schema';
import { User, UserDocument } from '../../users/schemas/user.schema';

export type MarketDocument = Market &
  mongoose.Document & { seller: UserDocument } & {
    product: ProductDocument;
  };

@Schema()
export class Market {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty({ description: '셀러 아이디' })
  seller: User; // 판매자 아이디

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  @ApiProperty({ description: '상품 아이디' })
  product: Product; // 상품 아이디

  @Prop({ default: Date.now })
  @ApiProperty({ description: '마켓데이터 등록일' })
  createdAt: Date; //등록일

  @Prop({ default: null })
  @ApiProperty({ description: '마켓데이터 삭제일' })
  deletedAt: Date; //삭제일
}

export const MarketSchema = SchemaFactory.createForClass(Market);
