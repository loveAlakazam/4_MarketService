import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Market, MarketSchema } from '../markets/schemas/markets.schema';
import { ProductsRepository } from '../products/products.repository';
import { MarketsRepository } from '../markets/markets.repository';
import { HttpExceptionFilter } from '../commons/filters/http-exception/http-exception.filter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Market.name, schema: MarketSchema },
    ]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ProductsRepository,
    MarketsRepository,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class UsersModule {}
