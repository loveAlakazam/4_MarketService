import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * 이메일 계정을 갖는 유저의 존재유무를 확인
   * @param email
   * @returns
   */
  async checkExistUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }

  /**
   * 새로운 회원 등록
   */
  async createNewUser(
    signUpDto: SignUpDto,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const createdUser = await this.userModel.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  /**
   * 유저 아이디 조회
   */
  async findUserById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    return user;
  }

  // 모든 유저 조회
  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  // 유저정보수정
  async updateUserInfo(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  // 유저삭제
  async removeUser(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  /**
   * TODO
   * 리프래시 토큰 수정
   */
  async updateRefreshToken(user, refreshToken: string) {
    await this.userModel.findOneAndUpdate(
      { id: user._id },
      { refreshToken: refreshToken },
    );
  }
}