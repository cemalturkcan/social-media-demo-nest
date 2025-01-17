import { redisStore } from 'cache-manager-redis-yet';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [],
  exports: [CacheModule],
})
export class CustomCacheModule {}
