import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = mongoose.HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  name: string; //상풍명

  @Prop()
  price: number; // 가격

  @Prop()
  description: string; //설명글

  @Prop([String])
  category: string[]; //카테고리

  @Prop()
  endOrderDate: Date; //주문마감일

  @Prop()
  buyCountry: string; //구매지역

  // 물건:판매자 = N:1
  // 판매자(User 중 isSeller가 true 인 사람만)
  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  //   user: User;

  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
