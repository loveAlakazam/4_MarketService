import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  // 모든 유저 검색
  async findAllUsers() {
    return await this.repository.findAllUsers();
  }

  // 이메일 로 유저검색
  async findUserByEmail(email: string) {
    return await this.repository.checkExistUserByEmail(email);
  }

  // 유저아이디(_id) 로 유저검색
  async findUserById(userId: string): Promise<UserDocument> {
    return await this.repository.findUserById(userId);
  }

  // 회원정보 수정
  async updateUserInfo(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.repository.updateUserInfo(id, updateUserDto);
  }

  async removeUser(id: string): Promise<UserDocument> {
    return await this.repository.removeUser(id);
  }
}
