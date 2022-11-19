import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { ProductsRepository } from '../../products/products.repository';
import { MarketsRepository } from '../../markets/markets.repository';

const modekDataSource = () => ({});
const mockRepository = {
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: UsersRepository;
  let productRepository: ProductsRepository;
  let marketRepository: MarketsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getModelToken(User.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
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
        ProductsRepository,
        MarketsRepository,
      ],
    }).compile();

    userService = await module.get<UsersService>(UsersService);
    userRepository = await module.get<UsersRepository>(UsersRepository);
    productRepository = await module.get<ProductsRepository>(
      ProductsRepository,
    );
    marketRepository = await module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
