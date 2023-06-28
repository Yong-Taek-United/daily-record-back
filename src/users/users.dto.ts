import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ format: 'email' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: '테스트' })
  readonly username: string;

  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  password: string;

  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  password2: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  password?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  isActive?: boolean;
}

export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  password: string;
}
