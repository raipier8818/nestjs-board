import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient, RedisClientType } from 'redis';
import * as session from 'express-session';
import databaseConfig from './config/database.config';

// const redisClient = createClient({
// host: 'redis-16994.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com',
// port: 16994,
// password: 'LLwfZORaBN5dvspbjMZ3c9rEwqsLckaq',
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const redisConfig = app.get<ConfigType<typeof databaseConfig>>(
    databaseConfig.KEY,
  ).redis;

  const redisClient: RedisClientType = createClient({
    password: redisConfig.password,
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
    },
  });

  await redisClient.connect().catch(console.error);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: config.session.maxAge,
      },
      store: new RedisStore({
        client: redisClient,
        ttl: config.session.maxAge / 1000,
        prefix: 'session:',
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(config.port);
}
bootstrap();
