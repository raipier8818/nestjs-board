import { User } from 'src/user/user.schema';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async validateAndSaveUser(user: User): Promise<User> {
    const { name, email } = user;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      return existingUser;
    }

    await this.userService.createUser({
      name,
      email,
    });

    return user;
  }
}
