import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MarketsRepository } from '../../markets/markets.repository';
import { ProductsController } from '../products.controller';
import { ProductsRepository } from '../products.repository';
import { ProductsService } from '../products.service';
import { Product } from '../schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { SellerGuard } from '../../auth/guards/local-auth.guard';

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
      ],
    })
      .overrideGuard(SellerGuard)
      .useValue(mockGuards.SellerGuard)
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    app.init();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<ProductsRepository>(ProductsRepository);
    marketRepository = module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
