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
  name: string; // 상품명

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_CATEGORIES)
  category: string; // 상품 카테고리

  @IsOptional()
  @IsNumber()
  @Min(1000) // 최소가격: 1000원
  price: number; //상품 가격

  @IsOptional()
  @IsString()
  description: string; // 상품 요약설명

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_COUNTRIES)
  buyCountry: string; // 구매 국가

  @IsOptional()
  @IsString()
  buyLocation: string; //구매지역

  @IsOptional()
  @IsDateString()
  @Matches(DATE_REGEX)
  closeDate?: Date; // 주문마감일
}
