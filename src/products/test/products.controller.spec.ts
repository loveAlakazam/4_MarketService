import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsRepository } from '../../markets/markets.repository';
import { ProductsController } from '../products.controller';
import { ProductsRepository } from '../products.repository';
import { ProductsService } from '../products.service';
import { Product } from '../schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { User } from '../../users/schemas/user.schema';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let repository: ProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        MarketsRepository,
        ProductsRepository,
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
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
