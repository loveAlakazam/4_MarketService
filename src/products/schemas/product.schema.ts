import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { PRODUCT_CATEGORIES } from '../enums/categories';
import { PRODUCT_COUNTRIES } from '../enums/countries';

export type ProductDocument = Product &
  mongoose.Document & { user: UserDocument };

@Schema()
export class Product {
  /**
   * 물건:셀러 = N:1
   * 셀러: User 중 isSeller가 true 인 회원을 의미합니다.
   */

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty({ description: '셀러 아이디' })
  user: User;

  @Prop({ required: true })
  @ApiProperty({ description: '상품명' })
  name: string; //상풍명

  @Prop({
    required: true,
    default: PRODUCT_COUNTRIES.ETC,
    enum: PRODUCT_COUNTRIES,
  })
  @ApiProperty({ description: '구매국가' })
  buyCountry: string; //구매국가

  /**
   * 구매지역
   * - null: 전지역
   */
  @Prop({
    default: null,
  })
  @ApiProperty({ description: '구매지역' })
  buyLocation: string; // 구매지역

  @Prop({
    required: true,
    default: PRODUCT_CATEGORIES.NO,
    enum: PRODUCT_CATEGORIES,
  })
  @ApiProperty({ description: '상품 카테고리' })
  category: string; //카테고리

  @Prop({ required: true })
  @ApiProperty({ description: '상품 가격' })
  price: number; // 가격

  @Prop()
  @ApiProperty({ description: '상품 상세설명' })
  description: string; //설명글

  /**
   * 주문마감일
   * - null : 마감기한이 없음.
   */
  @Prop({ default: null })
  @ApiProperty({ description: '주문마감일' })
  closeDate: Date; //주문마감일

  @Prop({ default: Date.now() })
  @ApiProperty({ description: '상품 등록일' })
  createdAt: Date; // 등록일

  @Prop({ default: null })
  @ApiProperty({ description: '상품 삭제일' })
  deletedAt: Date; // 삭제일
}

export const ProductSchema = SchemaFactory.createForClass(Product);
