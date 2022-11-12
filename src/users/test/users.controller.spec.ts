import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
  UserNotSellerGuard,
} from '../../auth/guards/local-auth.guard';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import * as request from 'supertest';

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
  const mockGuards = {
    CanActivate: jest.fn((request) => (request ? true : false)),
    CanActivateNotSellerGuard: jest.fn((request) => {
      const user = request?.session?.passport?.user;
      return user?.isSeller === false;
    }),
    CanActivateAuthenticatedGuard: jest.fn(
      (request) => request?.session?.passport?.user,
    ),
  };

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
        AuthenticatedGuard,
        AuthService,
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockGuards.CanActivate)
      .overrideGuard(UserNotSellerGuard)
      .useValue(mockGuards.CanActivateNotSellerGuard)
      .overrideGuard(AuthenticatedGuard)
      .useValue(mockGuards.CanActivateAuthenticatedGuard)
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

  // 유저 회원가입 테스트
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
        .expect(201);
    });
  });

  // 셀러 등록 테스트
  describe('enrollSeller', () => {
    // 유저 로그인 테스트
    describe('signIn', () => {
      it('should be signIn', async () => {
        const agent = request.agent(app.getHttpServer());

        await agent
          .post('/api/auth/sign-in')
          .send({
            email: 'giseok@bankb.io',
            password: 'bank2Brothers@',
          })
          .expect(201);
      });
    });

    describe('signIn before erollSeller', () => {
      let agent;

      // 유저 로그인
      beforeEach(async () => {
        agent = request.agent(app.getHttpServer());
        await agent
          .post('/api/auth/sign-in')
          .send({
            email: 'giseok@bankb.io',
            password: 'bank2Brothers@',
          })
          .expect(201);
      });

      it('should be update to sellerUser', async () => {
        await agent
          .patch('/api/users/seller')
          .send({ sellerName: '기스깅' })
          .expect(200);
      });
    });
  });

  // 유저 정보 조회 테스트
  describe('profile', () => {
    // 유저로그인
    let agent;
    beforeEach(async () => {
      agent = request.agent(app.getHttpServer());
      await agent
        .post('/api/auth/sign-in')
        .send({
          email: 'giseok@bankb.io',
          password: 'bank2Brothers@',
        })
        .expect(201);
    });

    // 유저로그인 후 유저정보 조회
    it('should be get profile', async () => {
      await agent.get('/api/users/profile').expect(200);
    });
  });
});
