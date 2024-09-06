import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.schema';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async serializeUser(
    user: User,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    console.log(user, 'serializeUser');
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: any, user?: any) => void,
  ): Promise<any> {
    console.log(payload, 'deserializeUser');
    const user = await this.authService.validateAndSaveUser(payload);
    done(null, user);
  }
}
