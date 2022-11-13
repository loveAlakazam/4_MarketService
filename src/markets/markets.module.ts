import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { Market, MarketSchema } from './schemas/markets.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { MarketsRepository } from './markets.repository';

@Module({
  imports: [
    // 몽구스 모듈 주입
    MongooseModule.forFeature([{ name: Market.name, schema: MarketSchema }]),
  ],
  controllers: [MarketsController],
  providers: [
    MarketsService,
    MarketsRepository,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class MarketsModule {}
