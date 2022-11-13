import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsRepository } from '../../markets/markets.repository';
import { ProductsRepository } from '../products.repository';
import { ProductsService } from '../products.service';
import { Product } from '../schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { User } from '../../users/schemas/user.schema';

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: ProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    productService = await module.get<ProductsService>(ProductsService);
    productRepository = await module.get<ProductsRepository>(
      ProductsRepository,
    );
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  // 상품등록
});
