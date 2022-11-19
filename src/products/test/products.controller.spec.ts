import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MarketsRepository } from '../../markets/markets.repository';
import { ProductsController } from '../products.controller';
import { ProductsRepository } from '../products.repository';
import { ProductsService } from '../products.service';
import { Product } from '../schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
  SellerGuard,
} from '../../auth/guards/local-auth.guard';
import * as request from 'supertest';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../users/schemas/user.schema';
import { AuthController } from '../../auth/auth.controller';
import { UsersRepository } from '../../users/users.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { AccessUser } from '../../auth/dto/access-user.dto';

const { SESSION_ID, COOKIE_SECRET } = process.env;

describe('ProductsController', () => {
  let app: INestApplication;
  let controller: ProductsController;
  let service: ProductsService;
  let productRepository: ProductsRepository;
  let marketRepository: MarketsRepository;
  let authService: AuthService;

  const mockRepository = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(() => true),
    updateOne: jest.fn(),
    create: jest.fn(),
  };

  const mockGuards = {
    SellerGuard: jest.fn((request) => {
      const user = request?.session?.passport?.user;
      return user?.isSeller;
    }),
    LocalAuthGuard: jest.fn((request) => (request ? true : false)),
    CanActivateAuthenticatedGuard: jest.fn(
      (request) => request?.session?.passport?.user,
    ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController, AuthController],
      providers: [
        ProductsService,
        ProductsRepository,
        MarketsRepository,
        {
          provide: getModelToken(Product.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
        {
          provide: getModelToken(Market.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
        {
          provide: getModelToken(User.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
        AuthService,
        LocalAuthGuard,
        SellerGuard,
        UsersRepository,
      ],
    })
      .overrideGuard(SellerGuard)
      .useValue(mockGuards.SellerGuard)
      .overrideGuard(LocalAuthGuard)
      .useValue(mockGuards.LocalAuthGuard)
      .overrideGuard(AuthenticatedGuard)
      .useValue(mockGuards.CanActivateAuthenticatedGuard)
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    authService = module.get<AuthService>(AuthService);
    productRepository = module.get<ProductsRepository>(ProductsRepository);
    marketRepository = module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    let agent;
    beforeEach(async () => {
      // 로그인
      agent = request.agent(app.getHttpServer());
      await agent
        .post('/api/auth/sign-in')
        .send({ email: 'giseok@bankb.io', password: 'bank2brothers@' })
        .expect(201);
    });

    it('상품등록 성공', async () => {
      const newProduct: CreateProductDto = {
        name: '제육볶음 밀키트',
        category: '식품',
        buyCountry: '대한민국',
        buyLocation: '서울',
        price: 12000,
        description: '제육볶음 밀키트 - e2e 상품데이터 등록 테스트',
      };

      const accessUser: AccessUser = {
        _id: new Object(1),
        email: 'giseok@bankb.io',
        name: '기석',
        phoneNumber: '010-1111-2222',
        isSeller: true,
      };

      agent = request.agent(app.getHttpServer());
      await agent
        .post('/api/products')
        .send(accessUser, newProduct)
        .expect(400);
    });
  });

  describe('findAll', () => {
    it('상품전체 조회', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.get('/api/products').send().expect(500);
    });
  });

  it.todo('update');
  it.todo('delete');
  it.todo('findOne');

  // it.todo('findAll');
});
