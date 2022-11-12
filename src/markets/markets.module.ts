import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { Market, MarketSchema } from './schemas/markets.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { MarketsRepository } from './markets.repository';
import { ProductsRepository } from '../products/products.repository';
import { UsersRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Market.name, schema: MarketSchema }]), // 마켓 몽구스 모듈 주입
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), // 상품 몽구스 모듈 주입
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // 유저 몽구스 모듈 주입
  ],
  controllers: [MarketsController],
  providers: [
    MarketsService,
    MarketsRepository,
    ProductsRepository,
    UsersRepository,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class MarketsModule {}
