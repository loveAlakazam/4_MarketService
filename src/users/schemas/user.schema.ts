import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
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
  isSeller: boolean; // 셀러 회원 여부

  @Prop()
  sellerNickname: string; // 셀러 닉네임

  @Prop({ default: Date.now })
  createdAt: Date; // 등록일

  @Prop()
  deletedAt: Date; // 삭제일
}

export const UserSchema = SchemaFactory.createForClass(User);
