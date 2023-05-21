import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly username: string;

  @IsString()
  password: string;

  @IsString()
  password2: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}