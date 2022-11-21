import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  AuthenticatedGuard,
  UserNotSellerGuard,
} from '../auth/guards/local-auth.guard';
import { User } from '../auth/decorators/auth.decorator';
import { EnrollSellerDto } from './dto/enroll-seller.dto';

@Controller('users')
@ApiTags('유저 API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * [PATCH] /api/users/seller
   * seller 로 등록
   * 아직 셀러로 등록하지 않은 로그인된 유저만 사용가능
   */
  @UseGuards(UserNotSellerGuard)
  @Patch('seller')
  @ApiOperation({
    summary: '셀러등록 API',
    description:
      '일반회원들만 요청가능한 API이며, 응답성공하게되면 셀러회원 으로 전환합니다.',
  })
  async enrollSeller(@User() user, @Body() enrollSellerDto: EnrollSellerDto) {
    this.usersService.updateUserInfo(user?._id, {
      ...enrollSellerDto,
      isSeller: true,
    });
  }

  /**
   * [GET] /api/users/profile
   * 로그인한 유저정보 조회
   */
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  @ApiOperation({
    summary: '로그인한 회원정보 조회 API',
    description: '회원정보를 조회할 수 있습니다.',
  })
  async getUserInfo(@User() user) {
    return this.usersService.findUserById(user?._id);
  }

  /**
   * [DELETE] /api/users/:id
   * 유저 탈퇴
   * - 탈퇴한 유저가 셀러일경우, 탈퇴유저가 등록한 상품도 모두 삭제됩니다.
   */
  @UseGuards(AuthenticatedGuard)
  @Delete()
  @ApiOperation({
    summary: '회원탈퇴 API',
    description:
      '회원탈퇴를 합니다. 만일 탈퇴하려는 유저가 셀러유저일 경우에는 등록한 모든 상품도 삭제처리가 됩니다.',
  })
  async leaveUser(@User() user) {
    return this.usersService.leaveUser(user);
  }
}
