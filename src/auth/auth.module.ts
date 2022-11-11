import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/commons/filters/http-exception/http-exception.filter';
import { AuthController } from './auth.controller';
import { UsersRepository } from 'src/users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalStrategy } from './strategies/auth-local.strategy';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { SessionSerializer } from './sessions/auth.session.serializer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // User 다큐먼트 모델
    PassportModule.register({ defaultStrategy: 'local', session: true }), // PassportModule / local-strategy 전략사용 / session 등록
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy, // Guard 전략 Local-Strategy 추가
    SessionSerializer, // 세션 Serializer 사용
    ConfigService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    UsersRepository,
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
