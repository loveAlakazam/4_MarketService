import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
  UserNotSellerGuard,
} from '../../auth/guards/local-auth.guard';
import * as request from 'supertest';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../../products/schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { ProductsRepository } from '../../products/products.repository';
import { MarketsRepository } from '../../markets/markets.repository';
import { HttpExceptionFilter } from '../../commons/filters/http-exception/http-exception.filter';

const { SESSION_ID, COOKIE_SECRET } = process.env;

describe('UsersController', () => {
  let app: INestApplication;
  let userController: UsersController;
  let userService: UsersService;
  let userRepository: UsersRepository;
  let productRepository: ProductsRepository;
  let marketRepository: MarketsRepository;

  const mockRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(() => true),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(() => true),
    updateOne: jest.fn(),
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
        {
          provide: getModelToken(Product.name),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(Market.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function

          useValue: mockRepository,
        },
        LocalAuthGuard,
        UserNotSellerGuard,
        AuthenticatedGuard,
        AuthService,
        ProductsRepository,
        MarketsRepository,
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
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
    productRepository =
      moduleFixture.get<ProductsRepository>(ProductsRepository);
    marketRepository = moduleFixture.get<MarketsRepository>(MarketsRepository);
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
        agent = request.agent(app.getHttpServer());
        await agent
          .patch('/api/users/seller')
          .send({ sellerNickname: '기스깅' })
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
