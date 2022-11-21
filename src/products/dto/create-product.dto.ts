import { ApiProperty } from '@nestjs/swagger';
import { DATE_REGEX } from '../../commons/regexps/regexp';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Matches,
} from 'class-validator';
import { PRODUCT_CATEGORIES } from '../enums/categories';
import { PRODUCT_COUNTRIES } from '../enums/countries';

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    name: 'name',
    description: '상품명',
    example: '아디다스 화이트 90 여성',
  })
  name: string; //상품명

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_CATEGORIES)
  @ApiProperty({
    name: 'category',
    description:
      '카테고리 (카테고리 없음/기타/의류/가방/전자제품/식품/가구/화장품/인테리어 중 선택)',
    example: '의류',
  })
  category?: string = PRODUCT_CATEGORIES.NO; // 상품카테고리

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_COUNTRIES)
  @ApiProperty({
    name: 'buyCountry',
    description:
      '구매국가 (지역상관없음/대한민국/미국/일본/영국/독일/프랑스/중국/대만/캐나다' +
      '/홍콩/스위스/오스트리아/필리핀/네덜란드/덴마크/인도/뉴질랜드/호주/말레이시아/' +
      '스웨덴/싱가포르/벨기에/노르웨이/터키/이탈리아 중 선택)',
    example: '대한민국',
  })
  buyCountry?: string = PRODUCT_COUNTRIES.ETC; //구매국가

  @IsNumber()
  @ApiProperty({ name: 'price', description: '상품가격', example: 75000 })
  price: number; // 상품가격

  @IsString()
  @ApiProperty({
    name: 'description',
    description: '상품상세설명',
    example: '아디다스 신발 상품에 대한 상세정보입니다.',
  })
  description: string; //상품설명

  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'buyLocation',
    description: '구매지역(주소입니다.)',
    example: '서울특별시 강남구',
  })
  buyLocation?: string = null; // 구매지역

  @IsOptional()
  @IsDateString()
  @Matches(DATE_REGEX)
  @ApiProperty({
    name: 'closeDate',
    description:
      '주문마감일 (주문마감일이 없다면 request에서 closeDate를 빼도 됩니다.)',
    example: '2022-12-31',
  })
  closeDate?: Date = null; // 주문마감일
}
