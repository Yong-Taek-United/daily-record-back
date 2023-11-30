import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { textLength } from '../configs/settings/dto.config';
import { AuthType } from 'src/shared/types/enums/users.enum';

export class CreateUserDto {
  @IsEmail()
  @Length(textLength.email.min, textLength.email.max, {
    message: `이메일을 다시 확인해주십시오.(${textLength.email.min}~${textLength.email.max}자)`,
  })
  @ApiProperty({ format: 'email' })
  readonly email: string;

  @IsString()
  @Length(textLength.nickname.min, textLength.nickname.max, {
    message: `이름을 다시 확인해주십시오.(${textLength.nickname.min}~${textLength.nickname.max}자)`,
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
  @ApiProperty({ example: AuthType.BASIC })
  authType: AuthType = AuthType.BASIC;
}

export class UpdateUserBasicDto {
  @IsString()
  @Length(textLength.username.min, textLength.username.max, {
    message: `계정을 다시 확인해주십시오.(${textLength.username.min}~${textLength.username.max}자)`,
  })
  @ApiProperty({ example: 'test0001' })
  username: string;

  @IsString()
  @Length(textLength.username.min, textLength.username.max, {
    message: `이름을 다시 확인해주십시오.(${textLength.nickname.min}~${textLength.nickname.max}자)`,
  })
  @ApiProperty({ example: '테스트' })
  nickname: string;
}

export class UpdateUserProfileDto {
  @IsString()
  @Length(textLength.introduce.min, textLength.introduce.max)
  @ApiProperty({ example: '안녕하세요, 반갑습니다.' })
  introduce: string;
}

export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '' })
  emailToken: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  emailLogId: number;

  @IsNotEmpty()
  @IsString()
  @Length(textLength.password.min, textLength.password.max, {
    message: `비밀번호를 다시 확인해주십시오.(${textLength.password.min}~${textLength.password.max}자)`,
  })
  @ApiProperty({ example: 'qwer1234' })
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({ example: 'qwer1234' })
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(textLength.password.min, textLength.password.max, {
    message: `비밀번호를 다시 확인해주십시오.(${textLength.password.min}~${textLength.password.max}자)`,
  })
  @ApiProperty({ example: 'qwer1234' })
  newPassword: string;
}
