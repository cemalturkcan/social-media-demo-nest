import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [TranslateController],
  providers: [TranslateService],
})
export class TranslateModule {}
