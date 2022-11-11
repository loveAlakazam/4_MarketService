/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthenticatedGuard, LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './decorators/auth.decorator';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @url [POST] /api/auth/sign-up
   * @description 회원가입
   */
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
  }

  /**
   * @url [POST] /api/auth/sign-in
   * @description: 로그인
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@User() user): Promise<void> {}

  /**
   * @url [GET] /api/auth/sign-out
   * @description: 로그아웃
   */
  @UseGuards(AuthenticatedGuard)
  @Get('sign-out')
  async signOut(@Req() req) {
    req.session.destroy();
  }
}
