import { ApiProperty } from '@nestjs/swagger';
import { DATE_REGEX } from '../../commons/regexps/regexp';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { PRODUCT_CATEGORIES } from '../enums/categories';
import { PRODUCT_COUNTRIES } from '../enums/countries';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2) // 최소글자수 2자
  @ApiProperty({
    name: 'name',
    description: '수정 상품명',
    example: '2022 홀리데이 초콜릿',
  })
  name: string; // 상품명

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_CATEGORIES)
  @ApiProperty({
    name: 'category',
    description:
      '수정 카테고리 (카테고리 없음/기타/의류/가방/전자제품/식품/가구/화장품/인테리어 중 선택)',
    example: '식품',
  })
  category: string; // 상품 카테고리

  @IsOptional()
  @IsNumber()
  @Min(1000) // 최소가격: 1000원
  @ApiProperty({ name: 'price', description: '수정 상품가격', example: 18000 })
  price: number; //상품 가격

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'description',
    description: '수정 상품 상세설명',
    example:
      '블랙프라이데이 메인 핫딜 상품 작년판매량 10만개의 그 상품이 맞습니다!',
  })
  description: string; // 상품 설명

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_COUNTRIES)
  @ApiProperty({
    name: 'buyCountry',
    description:
      '구매국가 (지역상관없음/대한민국/미국/일본/영국/독일/프랑스/중국/대만/캐나다' +
      '/홍콩/스위스/오스트리아/필리핀/네덜란드/덴마크/인도/뉴질랜드/호주/말레이시아/' +
      '스웨덴/싱가포르/벨기에/노르웨이/터키/이탈리아 중 선택)',
    example: '미국',
  })
  buyCountry: string; // 구매 국가

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'buyLocation',
    description: '수정 구매지역(주소입니다.)',
    example: '미국 로스엔젤리너스',
  })
  buyLocation: string; //구매지역

  @IsOptional()
  @IsDateString()
  @Matches(DATE_REGEX)
  @ApiProperty({
    name: 'closeDate',
    description:
      '수정 주문마감일 (주문마감일이 없다면 request에서 closeDate를 빼도 됩니다.)',
    example: null,
  })
  closeDate?: Date; // 주문마감일
}
