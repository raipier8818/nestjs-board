import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateResult = await super.canActivate(context);

    if (canActivateResult) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return true;
  }
}

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const sessionUser: User = request.session.user as User;

      if (sessionUser.name === 'no-auth') {
        return true;
      }

      const user = await this.userService.findUserByEmail(sessionUser.email);

      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
