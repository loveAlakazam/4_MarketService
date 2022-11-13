import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Err } from '../commons/error/errorMessges';

export class UnableLoginException extends UnauthorizedException {
  constructor() {
    super(Err.USER.LOGIN_FAILED);
  }
}

export class AlreadyUserExistException extends BadRequestException {
  constructor() {
    super(Err.USER.EXIST_USER);
  }
}

export class AlreadyEnrolledSellerException extends BadRequestException {
  constructor() {
    super(Err.USER.DONT_ENROLL_SELLER_AGAIN);
  }
}
export class FailedAuthenticationException extends UnauthorizedException {
  constructor() {
    super(Err.USER.NOT_FOUND);
  }
}

export class NotFoundSellerException extends NotFoundException {
  constructor() {
    super(Err.USER.NOT_FOUND_SELLER);
  }
}
