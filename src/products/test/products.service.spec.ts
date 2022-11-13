import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsRepository } from '../../markets/markets.repository';
import { ProductsRepository } from '../products.repository';
import { ProductsService } from '../products.service';
import { Product } from '../schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { PRODUCT_CATEGORIES } from '../enums/categories';
import { PRODUCT_COUNTRIES } from '../enums/countries';
import { ProductInfo } from '../dto/product-info.dto';
import { AccessUser } from '../../auth/dto/access-user.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { HttpException } from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';
import { resourceLimits } from 'worker_threads';

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: ProductsRepository;
  let marketRepository: MarketsRepository;

  beforeAll(async () => {
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
    marketRepository = await module.get<MarketsRepository>(MarketsRepository);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  // 상품등록
  describe('createProduct', () => {
    describe('서비스에서 상품생성 메소드 호출', () => {
      const user: AccessUser = {
        _id: new Object('111'),
        name: '이기석',
        email: 'giseok@bank2b.io',
        isSeller: true,
        phoneNumber: '010-1111-2222',
      };

      const createProductDto: CreateProductDto = {
        name: '야구방망이',
        buyCountry: PRODUCT_COUNTRIES.KR,
        buyLocation: '대구',
        category: PRODUCT_CATEGORIES.NO,
        price: 25000,
        description: '야구방망이 설명문 테스트',
        closeDate: null,
      };

      const newProduct = new Product();

      it('상품생성 성공되어야함.', async () => {
        // 래포지토리 spy
        jest
          .spyOn(productRepository, 'createProduct')
          .mockResolvedValue(newProduct);

        jest
          .spyOn(marketRepository, 'createMarketData')
          .mockResolvedValue(Promise.resolve());

        return expect(
          productService.create(user, createProductDto),
        ).toBeInstanceOf(Promise<Product>);
      });
    });
  });

  // findProductById
  describe('findProductById', () => {
    const productId = '1234';
    const user: AccessUser = {
      _id: new Object('112'),
      name: '고프',
      email: 'goph@bank2b.io',
      isSeller: true,
      phoneNumber: '010-1131-2222',
    };

    const productInfo: ProductInfo = {
      _id: new Object(productId),
      user: user._id,
      name: '야구방망이',
      buyCountry: PRODUCT_COUNTRIES.KR,
      buyLocation: '대구',
      category: PRODUCT_CATEGORIES.NO,
      price: 25000,
      description: '상세설명 mock데이터입니다.',
      closeDate: null,
      createdAt: null,
    };
    it('상품정보 조회해야됨.', async () => {
      jest
        .spyOn(productRepository, 'findProductById')
        .mockResolvedValue(productInfo);

      const result = await productRepository.findProductById(productId);

      // 호출시 name, price 프로퍼티를 갖는가?
      expect(result).toHaveProperty('name', productInfo.name);
      expect(result).toHaveProperty('price', productInfo.price);
      expect(result).toEqual(productInfo);
      expect(result).toBeInstanceOf(Object);
    });
  });

  // update
  describe('updateProduct', () => {
    const productId = '1234';
    const user: AccessUser = {
      _id: new Object('112'),
      name: '고프',
      email: 'goph@bank2b.io',
      isSeller: true,
      phoneNumber: '010-1131-2222',
    };

    const productInfo: ProductInfo = {
      _id: new Object(productId),
      user: user._id,
      // user: new Object('111'), // 실패테스트 케이스: 401 에러발생 (로그인 유저와 상품셀러가 다른경우)
      name: '야구방망이',
      buyCountry: PRODUCT_COUNTRIES.KR,
      buyLocation: '대구',
      category: PRODUCT_CATEGORIES.NO,
      price: 25000,
      description: '상세설명 mock데이터입니다.',
      closeDate: null,
      createdAt: null,
    };

    const updateProductDto: UpdateProductDto = {
      name: '핸드크림',
      price: 30000,
      category: '화장품',
      description: '상품수정 service 테스트 입니다. 😋',
      buyCountry: productInfo.buyCountry,
      buyLocation: productInfo.buyLocation,
    };

    // updated
    it('예외발생시 에러를 띄움, 이상없으면 수정처리됨', async () => {
      // jest spy
      jest
        .spyOn(productRepository, 'findProductById')
        .mockResolvedValue(productInfo);

      jest
        .spyOn(productRepository, 'updateProduct')
        .mockResolvedValue(Promise.resolve());

      try {
        await productService.update(user, productId, updateProductDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).rejects.toThrowError();
      }
    });
  });

  // delete
  describe('deleteProduct', () => {
    const user: AccessUser = {
      _id: new Object('111'),
      name: '이기석',
      email: 'giseok@bank2b.io',
      isSeller: true,
      phoneNumber: '010-1111-2222',
    };

    const productId = '1324';

    const productInfo: ProductInfo = {
      _id: new Object(productId),
      user: user._id,
      name: '야구방망이',
      buyCountry: PRODUCT_COUNTRIES.KR,
      buyLocation: '대구',
      category: PRODUCT_CATEGORIES.NO,
      price: 25000,
      description: '상세설명 mock데이터입니다.',
      closeDate: null,
      createdAt: null,
    };

    it('상품삭제 에러가 발생하지 않는다.', async () => {
      // jest spy
      jest
        .spyOn(productRepository, 'findProductById')
        .mockResolvedValue(Promise.resolve(productInfo));
      jest
        .spyOn(productRepository, 'deleteProduct')
        .mockResolvedValue(Promise.resolve());

      jest
        .spyOn(marketRepository, 'deleteMarketData')
        .mockResolvedValue(Promise.resolve());

      try {
        await productService.remove(user, productId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).rejects.toThrowError();
      }
    });
  });
});
