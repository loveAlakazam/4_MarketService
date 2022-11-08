import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    // forFeature() : 환경설정역할 -> 모델을 정의
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    // MongooseModule.forFeature(....) // Products외 다른 콜렉션을 사용할 때 추가하면된다.
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
