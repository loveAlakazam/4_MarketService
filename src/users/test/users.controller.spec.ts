import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
  UserNotSellerGuard,
} from '../../auth/guards/local-auth.guard';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../../auth/auth.module';
import * as request from 'supertest';
import { UsersModule } from '../users.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
const { SESSION_ID, COOKIE_SECRET } = process.env;

describe('UsersController', () => {
  let app: INestApplication;
  let userController: UsersController;
  let userService: UsersService;
  let userRepository: UsersRepository;

  const mockRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(() => true),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(() => true),
  };
  const mockGuards = { CanActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController, AuthController],
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function

          useValue: mockRepository,
        },
        LocalAuthGuard,
        UserNotSellerGuard,
        AuthService,
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockGuards)
      .overrideGuard(UserNotSellerGuard)
      .useValue(mockGuards)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    userController = moduleFixture.get<UsersController>(UsersController);
    userService = moduleFixture.get<UsersService>(UsersService);
    userRepository = moduleFixture.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  // 일반유저
  const userInit = async () => {
    const password = 'bank2Brothers';
    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepository.createNewUser(
      {
        name: '이기석',
        email: 'giseok@bankb.io',
        phoneNumber: '010-7777-7777',
        password: password,
      },
      hashedPassword,
    );
  };

  // 셀러유저
  const sellerUserInit = async () => {
    const hashedPassword = await bcrypt.hash('bank2Brothers', 10);
    const user = await userRepository.createNewUser(
      {
        name: '제이락',
        email: 'jaylock@bankb.io',
        phoneNumber: '010-1234-4444',
        password: 'bank2Brothers',
      },
      hashedPassword,
    );

    // seller 로 전환
    const sellerInfo = await userRepository.updateUserInfo(user._id, {
      isSeller: true,
    });

    return sellerInfo;
  };

  // 유저 회원가입
  describe('signUp', () => {
    it('should be signUp', async () => {
      const password = 'bank2Brothers@';
      const agent = request.agent(app.getHttpServer());

      await agent
        .post('/api/auth/sign-up')
        .send({
          email: 'giseok@bankb.io',
          name: '이기석',
          phoneNumber: '010-7777-7777',
          password: password,
        })
        .expect(201); //201 <- error발생
    });
  });

  // 유저 로그인
  describe('signIn', () => {
    it('should be signIn', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent
        .post('/api/auth/sign-in')
        .send({
          email: 'giseok@bankb.io',
          password: 'bank2Brothers@',
        })
        .expect(201); // <- error (201)
    });
  });

  // 셀러 등록 테스트

  describe('enrollSeller', () => {
    describe('it should be 403', () => {
      let agent;
      beforeEach(async () => {
        // 유저 로그인
        agent = request.agent(app.getHttpServer());
        await agent
          .post('/api/auth/sign-in')
          .send({
            email: 'giseok@bankb.io',
            password: 'bank2Brothers@',
          })
          .expect(201); // < - error(201)
      });

      it('should be update to sellerUser', async () => {
        await agent
          .patch('/api/users/seller')
          .send({ sellerName: '기스깅' })
          .expect(200);
      });
    });
  });

  // describe('enrollSeller', () => {
  //   beforeEach(async () => {});
  // });
});
