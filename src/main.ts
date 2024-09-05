import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: config.session.maxAge

      }
    })
  )
  await app.listen(config.port);
}
bootstrap();
