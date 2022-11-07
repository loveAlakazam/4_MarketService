import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/filters/http-exception/http-exception.filter';

@Module({
  controllers: [MarketsController],
  providers: [
    MarketsService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class MarketsModule {}
