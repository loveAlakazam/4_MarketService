import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MarketsRepository } from '../../markets/markets.repository';
import { ProductsRepository } from '../products.repository';
import { ProductsService } from '../products.service';
import { Product } from '../schemas/product.schema';
import { Market } from '../../markets/schemas/markets.schema';
import { PRODUCT_CATEGORIES } from '../enums/categories';
import { PRODUCT_COUNTRIES } from '../enums/countries';
import { ProductInfo, ProductWithoutUserInfo } from '../dto/product-info.dto';
import { AccessUser } from '../../auth/dto/access-user.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { HttpException } from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  ProductDetailInfoDto,
  ProductSellerInfo,
} from '../dto/product-detail-info.dto';
import { object } from 'joi';

const mockMongoRepository = {
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockReturnThis(),
};

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
          useValue: mockMongoRepository,
        },
        {
          provide: getModelToken(Market.name),
          useValue: mockMongoRepository,
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

  // 전체상품조회
  describe('findAll', () => {
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
      description:
        '야구방맹이가 없어도, 투명방맹이로 섭씨100도 춤을 출 수 있어요',
      closeDate: null,
    };

    const seller: ProductSellerInfo = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isSeller: user.isSeller,
      sellerNickname: '기스깅',
    };

    const insertData: ProductDetailInfoDto = {
      info: {
        _id: new Object('12345'),
        name: createProductDto.name,
        buyCountry: createProductDto.buyCountry,
        buyLocation: createProductDto.buyLocation,
        category: createProductDto.category,
        price: createProductDto.price,
        description: createProductDto.description,
        closeDate: createProductDto.closeDate,
        createdAt: new Date(),
      },
      seller: seller,
    };

    // 데이터를 추가한다.
    beforeEach(async () => {
      jest
        .spyOn(productRepository, 'createProduct')
        .mockResolvedValue(new Product());
      jest
        .spyOn(marketRepository, 'createMarketData')
        .mockResolvedValue(Promise.resolve());

      expect(
        productService.create(user, createProductDto),
      ).resolves.toBeInstanceOf(Product);
    });

    it('전체상품을 조회할 수 있다.', async () => {
      jest
        .spyOn(productRepository, 'findAllProducts')
        .mockResolvedValue([insertData]);

      const result = await productService.findAll();
      expect(result.length).toBe(1);
    });
  });

  // 상품 상세조회
  describe('findOne', () => {
    // 상품정보
    const productInfo: ProductWithoutUserInfo = {
      _id: new Object(123),
      name: '에코백',
      buyCountry: PRODUCT_COUNTRIES.KR, //대한민국
      buyLocation: '대구',
      category: PRODUCT_CATEGORIES.BAGS, // 가방
      price: 10000,
      description: '상품상세조회 테스트',
      closeDate: new Date('2022-12-31'),
      createdAt: new Date(),
    };

    // 판매자 정보
    const productSeller: ProductSellerInfo = {
      _id: '1',
      name: '이기석',
      email: 'giseok@bank2brothers.io',
      phoneNumber: '010-1111-2222',
      isSeller: true,
      sellerNickname: '기스깅',
    };

    // 판매자가 올린 다른 상품
    const otherProduct: ProductInfo = {
      _id: new Object(124),
      user: new Object(productSeller._id),
      name: '에어맥스',
      buyCountry: PRODUCT_COUNTRIES.US,
      buyLocation: 'LA',
      category: PRODUCT_CATEGORIES.ELECTRONICS,
      price: 700000,
      description: '셀러가 올린 다른상품',
      closeDate: new Date('2022-12-31'),
      createdAt: new Date(),
    };

    const sellerOtherProducts: ProductInfo[] = [otherProduct];

    const productDetailInfo: ProductDetailInfoDto = {
      info: productInfo,
      seller: productSeller,
      others: sellerOtherProducts,
    };

    it('단일 상품의 정보를 조회할 수 있다.', async () => {
      jest
        .spyOn(productRepository, 'findOnePopulated')
        .mockResolvedValue(productDetailInfo);

      jest
        .spyOn(productRepository, 'findSellerOtherProducts')
        .mockResolvedValue(sellerOtherProducts);

      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValue(productDetailInfo);

      const result = await productService.findOne('123');
      expect(result).toHaveProperty('info');
      expect(result).toHaveProperty('seller');
      expect(result).toHaveProperty('others');
    });
  });
});
