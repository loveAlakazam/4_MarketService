import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type UserDocument = HydratedDocument<User>;

@Schema() // 모델정의
export class User {
  @Prop({ required: true })
  name: string; // 이름

  @Prop({ required: true })
  email: string; // 이메일주소

  @Prop({ required: true })
  password: string; // 비밀번호

  @Prop({ required: true })
  phoneNumber: string; //전화번호

  @Prop({ required: true, default: false })
  isSeller: boolean; //셀러 회원 여부

  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  // 유저:상품 = 1:N
  //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  //   products: Product[];
}

export const UserSchema = SchemaFactory.createForClass(User);
