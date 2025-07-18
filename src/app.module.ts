import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './configs/configuration';
import { DataSourceOptions } from 'typeorm';
import { CommonGatewayModule } from './modules/common-gateway/common-gateway.module';
import { ExternalGatewayModule } from './modules/external-gateway/external-gateway.module';
import { EntitiesModule } from './entities/entities.module';
import { SharedModule } from './shared/shared.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestContextMiddleware } from './shared/middleware/request-context.middleware';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> =>
        configService.get<DataSourceOptions>(
          'database',
        ) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
    }),

    CommonGatewayModule,
    ExternalGatewayModule,
    EntitiesModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware, LoggerMiddleware).forRoutes('');
  }
}
