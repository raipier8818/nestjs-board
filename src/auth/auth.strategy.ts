import { UserService } from './../user/user.service';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigType } from '@nestjs/config';
import authConfig from '../config/auth.config';
import { User } from '../user/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY) private readonly config: ConfigType<typeof authConfig>,
    private readonly userService: UserService
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
    done: VerifyCallback
  ) {
    const { name, emails } = profile;
    const email = emails[0].value;
    const username = name.givenName;
    let user: User = null;
    try{
      user = await this.userService.findUserByEmail(email);
      if (!user){
        await this.userService.createUser({
          email,
          name: username,
        });
  
        user = await this.userService.findUserByEmail(email);
      }
    }catch(e){
      console.log(e);
      throw new InternalServerErrorException();
    }
    done(null, user, { accessToken, refreshToken });
  }
}