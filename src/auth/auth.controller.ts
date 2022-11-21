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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthenticatedGuard, LocalAuthGuard } from './guards/local-auth.guard';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
@ApiTags('유저 Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @url [POST] /api/auth/sign-up
   * @description 회원가입
   */
  @Post('sign-up')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입이 완료되면 유저가 생성됩니다.',
  })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: '회원가입 성공' })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  /**
   * @url [POST] /api/auth/sign-in
   * @description: 로그인
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인 성공이후 쿠키가 생성되며 유효기간은 1분입니다.',
  })
  @ApiCreatedResponse({ description: '로그인 성공' })
  async signIn(): Promise<void> {}

  /**
   * @url [GET] /api/auth/sign-out
   * @description: 로그아웃
   */
  @UseGuards(AuthenticatedGuard)
  @Get('sign-out')
  @ApiOperation({
    summary: '로그아웃 API',
    description: '쿠키를 제거함으로써 로그아웃을 합니다.',
  })
  @ApiOkResponse({ description: '로그아웃 성공' })
  async signOut(@Req() req) {
    req.session.destroy();
  }
}
