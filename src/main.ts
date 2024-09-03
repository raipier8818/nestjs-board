import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  console.log(config);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(config.port);
}
bootstrap();
