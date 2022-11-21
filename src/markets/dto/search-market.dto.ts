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
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PRODUCT_COUNTRIES } from '../../products/enums/countries';
import { PRODUCT_CATEGORIES } from '../../products/enums/categories';
import { CLOSED_DATE_ORDER, CREATED_AT_ORDER } from '../enums/searchEnums';

export class SearchMarket {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ name: 'page', description: '페이지번호', example: 1 })
  page?: number = 1;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'name', description: '검색 상품명', example: '쿠키' })
  name?: string; // 검색어: 상품명

  @IsOptional()
  @IsEnum(PRODUCT_COUNTRIES)
  @ApiProperty({
    name: 'buyCountry',
    description: '검색 구매국가',
    example: '대한민국',
  })
  buyCountry: string; // 구매국가

  @IsOptional()
  @IsEnum(PRODUCT_CATEGORIES)
  @ApiProperty({
    name: 'category',
    description: '검색 카테고리',
    example: '식품',
  })
  category: string; // 카테고리

  @IsOptional()
  @IsEnum(CREATED_AT_ORDER)
  @ApiProperty({
    name: 'createdAt',
    description: '최신순 내림차순 정렬(상품등록일 가장 최근을 우선으로 정렬)',
    example: 'desc',
  })
  createdAt? = CREATED_AT_ORDER.DESC; // 등록날짜

  @IsOptional()
  @IsEnum(CLOSED_DATE_ORDER)
  @ApiProperty({
    name: 'closeDate',
    description:
      '주문마감일 오름차순 정렬(주문마감일이 빠른 것을 우선으로 정렬)',
    example: 'asc',
  })
  closeDate?; // 주문마감일
}
