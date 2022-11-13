import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { MarketsRepository } from '../markets/markets.repository';
import { Product, ProductSchema } from './schemas/product.schema';
import { Market, MarketSchema } from '../markets/schemas/markets.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersRepository } from '@src/users/users.repository';

@Module({
  imports: [
    // 몽구스 모듈 주입
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Market.name, schema: MarketSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    MarketsRepository,
    UsersRepository,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class ProductsModule {}
