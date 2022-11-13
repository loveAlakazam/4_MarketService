import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsController } from '../markets.controller';
import { MarketsRepository } from '../markets.repository';
import { MarketsService } from '../markets.service';
import { Market } from '../schemas/markets.schema';
import { Product } from '../../products/schemas/product.schema';
import { ProductsRepository } from '../../products/products.repository';
import { UsersRepository } from '../../users/users.repository';
import { User } from '../../users/schemas/user.schema';

describe('MarketsController', () => {
  let controller: MarketsController;
  let service: MarketsService;
  let repository: MarketsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketsController],
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

    controller = module.get<MarketsController>(MarketsController);
    service = module.get<MarketsService>(MarketsService);
    repository = module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
