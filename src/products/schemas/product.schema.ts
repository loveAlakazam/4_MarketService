import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

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
    default: '기타',
    enum: [
      '기타',
      '한국',
      '미국',
      '일본',
      '독일',
      '프랑스',
      '이탈리아',
      '영국',
      '아일랜드',
      '태국',
      '중국',
      '러시아',
      '노르웨이',
      '캐나다',
      '기타',
      '몽골',
      '베트남',
      '싱가폴',
      '터키',
      '브라질',
    ],
  })
  buyCountry: string; //구매국가

  @Prop({ required: true })
  category: string[]; //카테고리

  @Prop()
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
