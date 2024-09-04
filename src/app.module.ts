import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [
    PostModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigType<typeof databaseConfig>) => {
        if(process.env.NODE_ENV === 'test') {
          const mongod = await MongoMemoryServer.create();
          return {
            uri: mongod.getUri(),
          }
        }

        return {
          uri: config.mongoose.uri,
          dbName: config.mongoose.dbName,
        }
      },
      inject: [databaseConfig.KEY],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
