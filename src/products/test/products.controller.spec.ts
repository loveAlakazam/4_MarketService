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

describe('ProductsController', () => {
  let app: INestApplication;
  let controller: ProductsController;
  let service: ProductsService;
  let productRepository: ProductsRepository;
  let marketRepository: MarketsRepository;

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
      if (user) {
        return user?.isSeller;
      }
      return false;
    }),
    LocalAuthGuard: jest.fn((request) => (request ? true : false)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
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
        AuthService,
        LocalAuthGuard,
        SellerGuard,
      ],
    })
      .overrideGuard(SellerGuard)
      .useValue(mockGuards.SellerGuard)
      .overrideGuard(LocalAuthGuard)
      .useValue(mockGuards.LocalAuthGuard)
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
    productRepository = module.get<ProductsRepository>(ProductsRepository);
    marketRepository = module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    let agent;
    beforeAll(async () => {
      // 로그인
      agent = request.agent(app.getHttpServer());
      await agent
        .post('/api/auth/sign-in')
        .send({ email: 'giseok@bankb.io', password: 'bank2brothers@' })
        .expect(201);
    });

    it('상품등록 성공', async () => {
      agent = request.agent(app.getHttpServer());
      await agent
        .post('/api/products')
        .send({
          name: '제육볶음 밀키트',
          category: '식품',
          buyCountry: '대한민국',
          buyLocation: '서울',
          price: 12000,
          description: '제육볶음 밀키트 - e2e 상품데이터 등록 테스트',
          closeDate: null,
        })
        .expect(201);
    });
  });

  it.todo('update');
  it.todo('delete');
  it.todo('findOne');
  it.todo('findAll');
});
