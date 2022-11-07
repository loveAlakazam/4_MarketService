import { Module } from '@nestjs/common';
import { MongoDBConfigService } from './mongodb-config.service';

@Module({
  providers: [MongoDBConfigService],
})
export class MongoDBConfigModule {}
