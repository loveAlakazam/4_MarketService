import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsService } from '../markets.service';
import { MarketsRepository } from '../markets.repository';
import { ProductsRepository } from '../../products/products.repository';
import { Market } from '../schemas/markets.schema';
import { Product } from '../../products/schemas/product.schema';

describe('MarketsService', () => {
  let service: MarketsService;
  let repository: MarketsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketsService,
        MarketsRepository,
        ProductsRepository,
        {
          provide: getModelToken(Market.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
        {
          provide: getModelToken(Product.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
      ],
    }).compile();

    service = module.get<MarketsService>(MarketsService);
    repository = module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
