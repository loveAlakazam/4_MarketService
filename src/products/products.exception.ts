import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Err } from '../commons/error/errorMessges';

// 상품 조회 불가 오류
export class NotFoundProductException extends NotFoundException {
  constructor() {
    super(Err.PRODUCT.NOT_FOUND);
  }
}

// 상품 국가 오류
export class BadCountryProductException extends BadRequestException {
  constructor() {
    super(Err.PRODUCT.NOT_ALLOW_COUNTRY);
  }
}

// 상품 카테고리 오류
export class BadCategoryException extends BadRequestException {
  constructor() {
    super(Err.PRODUCT.NOT_ALLOW_CATEGORY);
  }
}
