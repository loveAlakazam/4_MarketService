import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  @ApiProperty({ description: '이름' })
  name: string; // 이름

  @Prop({ required: true, unique: true })
  @ApiProperty({ description: '이메일주소' })
  email: string; // 이메일주소

  @Prop({ required: true })
  @ApiProperty({ description: '비밀번호' })
  password: string; // 비밀번호

  @Prop({ required: true })
  @ApiProperty({ description: '전화번호' })
  phoneNumber: string; //전화번호

  @Prop({ required: true, default: false })
  @ApiProperty({
    description: '셀러회원 등록여부 (일반회원: false, 셀러회원: true)',
  })
  isSeller: boolean; // 셀러 회원 여부

  @Prop({ default: null })
  @ApiProperty({ description: '(셀러회원) 셀러 닉네임' })
  sellerNickname: string; // 셀러 닉네임

  @Prop({ default: Date.now })
  @ApiProperty({ description: '회원가입일' })
  createdAt: Date; // 등록일

  @Prop({ default: null })
  @ApiProperty({ description: '회원탈퇴일' })
  deletedAt: Date; // 삭제일

  @Prop({ default: null })
  @ApiProperty({ description: '(셀러회원) 계좌번호' })
  accountNumber: string; // 계좌번호

  @Prop({ default: null })
  @ApiProperty({ description: '(셀러회원) 예금주명' })
  accountName: string; // 예금주명

  @Prop({ default: null })
  @ApiProperty({ description: '(셀러회원) 은행명' })
  accountBank: string; // 은행명
}

export const UserSchema = SchemaFactory.createForClass(User);
