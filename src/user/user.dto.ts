export class CreateUserDto {
  email: string;
  name: string;
}

export class UpdateUserDto extends CreateUserDto {}
