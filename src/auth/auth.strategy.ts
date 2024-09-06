import { UserService } from './../user/user.service';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import authConfig from '../config/auth.config';
import { User } from '../user/user.schema';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.googleOauth.clientId,
      clientSecret: config.googleOauth.clientSecret,
      callbackURL: config.googleOauth.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails } = profile;
    const email = emails[0].value;
    const username = name.givenName;
    let user = {
      email,
      name: username,
    };
    try {
      user = await this.authService.validateAndSaveUser(user);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Error while validating user');
    }
    done(null, user, { accessToken, refreshToken });
  }
}
