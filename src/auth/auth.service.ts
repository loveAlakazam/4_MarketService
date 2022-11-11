import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlreadyUserExistException } from 'src/users/users.exception';
import { UsersRepository } from 'src/users/users.repository';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private repository: UsersRepository) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    // 이메일로 유저 존재 유무를 확인
    const existUser = await this.repository.checkExistUserByEmail(email);

    if (existUser) {
      throw new AlreadyUserExistException();
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원가입
    this.repository.createNewUser(signUpDto, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<any> {
    // 이메일에 알맞는 유저정보를 갖고온다.
    const user = await this.repository.checkExistUserByEmail(email);
    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다.');
    }

    // 로그인 성공여부 : 서버에 있는 비밀번호와 입력한 비밀번호가 일치한지 확인
    const isSuccessSignIn = await bcrypt.compare(password, user.password);
    if (isSuccessSignIn) {
      // 로그인 성공 : 비밀번호를 제외한 나머지를 리턴
      const { _id, name, email, phoneNumber, isSeller } = user;
      const userWithoutPassword = { _id, name, email, phoneNumber, isSeller };
      return userWithoutPassword;
    }

    // 로그인 실패
    return null;
  }
}
