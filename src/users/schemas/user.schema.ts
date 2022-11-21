import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
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

  @Prop({ default: null })
  deletedAt: Date; // 삭제일

  @Prop({ default: null })
  accountNumber: string; // 계좌번호

  @Prop({ default: null })
  accountName: string; // 예금주명

  @Prop({ default: null })
  accountBank: string; // 은행명
}

export const UserSchema = SchemaFactory.createForClass(User);
