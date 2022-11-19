import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from '../auth/dto/sign-up.dto';
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
  async checkExistUserByEmail(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      deletedAt: null,
    });
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
    return createdUser;
  }

  /**
   * 유저 아이디 조회
   */
  async findUserById(userId: string) {
    const user = await this.userModel.findOne({ _id: userId, deletedAt: null });
    return user;
  }

  // 모든 유저 조회
  async findAllUsers() {
    return this.userModel.find({ deletedAt: null || undefined });
  }

  // 유저정보수정
  async updateUserInfo(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne(
      { _id: id, deletedAt: null }, // 아직 탈퇴되지 않은 회원
      { ...updateUserDto },
    );
  }

  // 유저삭제
  async leaveUser(id: string) {
    return this.userModel
      .findByIdAndUpdate(
        { _id: id, deletedAt: null }, // 아직 탈퇴되지않은 회원
        { deletedAt: new Date() },
      )
      .exec();
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
