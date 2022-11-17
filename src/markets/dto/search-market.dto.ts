/**
 * 상품명을 검색어로 지정
 * - 검색어가 존재하지 않은 상황인경우에는 전체상품을 리턴
 *
 * 검색옵션
 * - 카테고리
 * - 국가
 * - 최신순(createdAt) : 'desc'
 * - 주문마감일순(closedDate) : 'asc'
 */

import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PRODUCT_COUNTRIES } from '../../products/enums/countries';
import { PRODUCT_CATEGORIES } from '../../products/enums/categories';
import { CLOSED_DATE_ORDER, CREATED_AT_ORDER } from '../enums/searchEnums';

export class SearchMarket {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number = 1;

  @IsOptional()
  @IsString()
  name?: string; // 검색어: 상품명

  @IsOptional()
  @IsEnum(PRODUCT_COUNTRIES)
  buyCountry: string; // 카테고리

  @IsOptional()
  @IsEnum(PRODUCT_CATEGORIES)
  category: string; // 카테고리

  @IsOptional()
  @IsEnum(CREATED_AT_ORDER)
  createdAt? = CREATED_AT_ORDER.DESC; // 등록날짜

  @IsOptional()
  @IsEnum(CLOSED_DATE_ORDER)
  closeDate?; // 주문마감일
}
