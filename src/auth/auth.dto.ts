import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ format: 'email' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  password: string;
}
