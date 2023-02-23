import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly username: string;

  @IsString()
  password: string;

  @IsString()
  readonly password2: string;
}