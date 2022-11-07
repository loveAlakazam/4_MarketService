import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UsersModule } from './users/users.module';
import { MarketsModule } from './markets/markets.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, MarketsModule, ProductsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes();
  }
}
