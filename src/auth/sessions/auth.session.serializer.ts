import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportSerializer } from '@nestjs/passport';
import { Model } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { AccessUser } from '../dto/access-user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super();
  }

  /**
   * 로그인 성공 요청시 사용자 정보를 세션에 저장
   */
  serializeUser(user: User, done: (err, user: User) => void) {
    //유저정보를 세션에 저장
    done(null, user);
  }

  /**
   * 세션에 저장된 유저정보를 반환
   */
  async deserializeUser(
    user: User,
    done: (err, user: AccessUser) => void,
  ): Promise<void> {
    // 세션에 저장되어있는 유저정보가 올바른 정보인지 확인
    const _userInfo = await this.userModel.findById(user);

    // 세션에 유저정보가 있다면 request.user 에 유저정보를 추가
    if (_userInfo) {
      const userInfo: AccessUser = {
        _id: _userInfo._id,
        name: _userInfo.name,
        email: _userInfo.email,
        phoneNumber: _userInfo.phoneNumber,
        isSeller: _userInfo.isSeller,
      };
      return done(null, userInfo);
    }

    return done(null, null);
  }
}
