import { Global, Module } from '@nestjs/common';
// import { ExceptionService } from './exception/exception.service';
// import { BaseService } from './services/base.service';
import { CacheService } from './services/cache.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { ExceptionService } from './exception/exception.service';
import { BaseService } from './services/base.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: Redis,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          db: configService.get('redis.db') || 0,
        });
      },
      inject: [ConfigService],
    },
    ExceptionService,
    CacheService,
    BaseService,
  ],
  exports: [BaseService, CacheService],
})
export class SharedModule {}
