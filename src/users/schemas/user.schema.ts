import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  name: string; // 이름

  @Prop({ required: true, unique: true })
  email: string; // 이메일주소

  @Prop({ required: true })
  password: string; // 비밀번호

  @Prop({ required: true })
  phoneNumber: string; //전화번호

  @Prop({ required: true, default: false })
  isSeller: boolean; // 셀러 회원 여부

  @Prop({ default: null })
  sellerNickname: string; // 셀러 닉네임

  @Prop({ default: Date.now })
  createdAt: Date; // 등록일

  @Prop()
  deletedAt: Date; // 삭제일

  @Prop()
  refreshToken: string; // 리프래시 토큰
}

export const UserSchema = SchemaFactory.createForClass(User);
