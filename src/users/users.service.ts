import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessUser } from '../auth/dto/access-user.dto';
import { UsersRepository } from './users.repository';
import { ProductsRepository } from '../products/products.repository';
import { MarketsRepository } from '../markets/markets.repository';

@UseFilters(new HttpExceptionFilter())
@Injectable()
export class UsersService {
  constructor(
    private readonly marketRepository: MarketsRepository,
    private readonly productRepository: ProductsRepository,
    private readonly repository: UsersRepository,
  ) {}

  // 모든 유저 검색
  async findAllUsers() {
    return await this.repository.findAllUsers();
  }

  // 이메일 로 유저검색
  async findUserByEmail(email: string) {
    return await this.repository.checkExistUserByEmail(email);
  }

  // 유저아이디(_id) 로 유저검색
  async findUserById(userId: string) {
    return await this.repository.findUserById(userId);
  }

  // 회원정보 수정
  async updateUserInfo(id: string, updateUserDto: UpdateUserDto) {
    return await this.repository.updateUserInfo(id, updateUserDto);
  }

  // 회원탈퇴
  async leaveUser(user: AccessUser) {
    const userId = user._id.toString();
    try {
      // seller 인지 확인
      if (user.isSeller) {
        // products 콜렉션에서 등록한 상품 모두 soft-delete 처리
        await this.productRepository.deleteProductsByLeaveSeller(userId);

        // markets 콜렉션에서 모두 soft-delete 처리
        await this.marketRepository.deleteMarketDataByLeaveSeller(userId);
      }

      // 탈퇴
      return await this.repository.leaveUser(userId);
    } catch (error) {
      throw error;
    }
  }
}
