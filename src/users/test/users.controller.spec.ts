import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import {
  AuthenticatedGuard,
  UserNotSellerGuard,
} from '../../auth/guards/local-auth.guard';
import { UsersController } from '../users.controller';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { User, UserDocument, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../../auth/auth.module';
import * as request from 'supertest';

describe('UsersController', () => {
  let app: INestApplication;
  let userController: UsersController;
  let userService: UsersService;
  let userRepository: UsersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function

          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  describe('enrollSeller', () => {
    it('비회원 유저 요청시 404 에러', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent
        .patch('/api/users/seller')
        .send({ sellerName: '기스깅' })
        .expect(404);
    });
  });
});
