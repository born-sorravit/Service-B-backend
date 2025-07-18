import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { ExceptionService } from './shared/exception/exception.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  logger.log('Application starting...');

  app.setGlobalPrefix('api');

  // Global interceptor for consistent response format
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global filter for error handling
  app.useGlobalFilters(new ExceptionService());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
    }),
  );
  // await app.listen(3000);

  const configService = app.get(ConfigService);
  const port = configService.get('port') || 3003;

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
