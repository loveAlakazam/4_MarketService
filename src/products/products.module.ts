import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsRepository } from './products.repository';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/commons/filters/http-exception/http-exception.filter';

@Module({
  imports: [
    // 상품 몽구스 모듈 주입
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class ProductsModule {}
