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
  name: string; //상품명

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_CATEGORIES)
  category?: string = PRODUCT_CATEGORIES.NO; // 상품카테고리

  @IsOptional()
  @IsString()
  @IsEnum(PRODUCT_COUNTRIES)
  buyCountry?: string = PRODUCT_COUNTRIES.ETC; //구매국가

  @IsNumber()
  price: number; // 상품가격

  @IsString()
  description: string; //상품요약설명

  @IsOptional()
  @IsString()
  buyLocation?: string = null; // 구매지역

  @IsOptional()
  @IsDateString()
  @Matches(DATE_REGEX)
  closeDate?: Date = null; // 주문마감일
}
