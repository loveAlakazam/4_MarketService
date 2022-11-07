import { HttpException } from '@nestjs/common';

export class MarketCustomException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
