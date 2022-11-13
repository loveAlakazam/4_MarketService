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

  @IsString()
  @IsEnum(PRODUCT_CATEGORIES)
  category: string; // 상품카테고리

  @IsString()
  @IsEnum(PRODUCT_COUNTRIES)
  buyCountry: string; //구매국가

  @IsNumber()
  price: number; // 상품가격

  @IsString()
  description: string; //상품요약설명

  @IsOptional()
  @IsDateString()
  @Matches(DATE_REGEX)
  closeDate?: Date; // 주문마감일
}
