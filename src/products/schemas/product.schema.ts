import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { PRODUCT_CATEGORIES } from '../enums/categories';
import { PRODUCT_COUNTRIES } from '../enums/countries';

export type ProductDocument = Product & mongoose.Document;

@Schema()
export class Product {
  /**
   * 물건:셀러 = N:1
   * 셀러: User 중 isSeller가 true 인 회원을 의미합니다.
   */

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  name: string; //상풍명

  @Prop({
    required: true,
    default: PRODUCT_COUNTRIES.ETC,
    enum: PRODUCT_COUNTRIES,
  })
  buyCountry: string; //구매국가

  @Prop({
    required: true,
    default: PRODUCT_CATEGORIES.NO,
    enum: PRODUCT_CATEGORIES,
  })
  category: string; //카테고리

  @Prop({ required: true })
  price: number; // 가격

  @Prop()
  description: string; //설명글

  @Prop({ default: null })
  closeDate: Date; //주문마감일

  @Prop({ default: Date.now })
  createdAt: Date; // 등록일

  @Prop()
  deletedAt: Date; // 삭제일
}

export const ProductSchema = SchemaFactory.createForClass(Product);
