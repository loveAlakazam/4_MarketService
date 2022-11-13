import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsService } from '../markets.service';
import { MarketsRepository } from '../markets.repository';
import { ProductsRepository } from '../../products/products.repository';
import { UsersRepository } from '../../users/users.repository';
import { Market } from '../schemas/markets.schema';
import { Product } from '../../products/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

describe('MarketsService', () => {
  let service: MarketsService;
  let repository: MarketsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketsService,
        MarketsRepository,

        {
          provide: getModelToken(Market.name),
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
