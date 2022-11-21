import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './commons/filters/all-exceptions/all-exceptions.filter';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filters/http-exception/http-exception.filter';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { sessionConfig } from './auth/sessions/auth.session.config';
import { setupSwagger } from './commons/swagger/swagger.config';

async function bootstrap() {
  /*
  // winston logger
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly,',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    }),
  });
  */

  const app = await NestFactory.create(AppModule);

  // Swagger 적용
  // Swagger 호출 URL: /api-docs
  setupSwagger(app);

  // URL의 최상단을 /api 로 한다.
  app.setGlobalPrefix('/api');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // WinstonLogger 전역 스코프에 적용
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 세션적용
  sessionConfig(app);

  // HttpExceptionFilter을 전역 스코프에 적용.
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
