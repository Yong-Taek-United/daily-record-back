import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { textLength } from '../config/settings/dto.config';

export class CreateUserDto {
  @IsEmail()
  @Length(textLength.email.min, textLength.email.max, {
    message: `이메일을 다시 확인해주십시오.(${textLength.email.min}~${textLength.email.max}자)`,
  })
  @ApiProperty({ format: 'email' })
  readonly email: string;

  @IsString()
  @Length(textLength.username.min, textLength.username.max, {
    message: `계정을 다시 확인해주십시오.(${textLength.username.min}~${textLength.username.max}자)`,
  })
  @ApiProperty({ example: 'test0001' })
  readonly username: string;

  @IsString()
  @Length(textLength.nickname.min, textLength.nickname.max, {
    message: `닉네임을 다시 확인해주십시오.(${textLength.nickname.min}~${textLength.nickname.max}자)`,
  })
  @ApiProperty({ example: '테스트' })
  readonly nickname: string;

  @IsString()
  @Length(textLength.password.min, textLength.password.max, {
    message: `비밀번호를 다시 확인해주십시오.(${textLength.password.min}~${textLength.password.max}자)`,
  })
  @ApiProperty({ example: 'qwer1234' })
  password: string;

  @IsString()
  @Length(textLength.password.min, textLength.password.max, {
    message: `비밀번호를 다시 확인해주십시오.(${textLength.password.min}~${textLength.password.max}자)`,
  })
  @ApiProperty({ example: 'qwer1234' })
  password2: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(textLength.password.min, textLength.password.max, {
    message: `비밀번호를 다시 확인해주십시오.(${textLength.password.min}~${textLength.password.max}자)`,
  })
  @ApiProperty({ example: 'qwer1234' })
  password?: string;

  @IsOptional()
  @IsString()
  @Length(textLength.password.min, textLength.password.max, {
    message: `비밀번호를 다시 확인해주십시오.(${textLength.password.min}~${textLength.password.max}자)`,
  })
  @ApiProperty({ example: 'qwer1234' })
  password2?: string;

  @IsString()
  @Length(textLength.username.min, textLength.username.max, {
    message: `계정을 다시 확인해주십시오.(${textLength.username.min}~${textLength.username.max}자)`,
  })
  @ApiProperty({ example: 'test0001' })
  username?: string;

  @IsString()
  @Length(textLength.username.min, textLength.username.max, {
    message: `닉네임을 다시 확인해주십시오.(${textLength.nickname.min}~${textLength.nickname.max}자)`,
  })
  @ApiProperty({ example: '테스트' })
  nickname?: string;

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
