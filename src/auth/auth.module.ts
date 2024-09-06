import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './auth.strategy';
import authConfig from '../config/auth.config';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { AuthSerializer } from './auth.serializer';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'google',
      session: true,
    }),
    ConfigModule.forFeature(authConfig),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, AuthSerializer],
})
export class AuthModule {}
