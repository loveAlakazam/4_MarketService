import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UsersModule } from './users/users.module';
import { MarketsModule } from './markets/markets.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, MarketsModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
