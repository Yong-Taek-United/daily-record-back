import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { EmailType } from '../types/enums/emailLog.enum';

export class VerifyEmailDto {
  @IsEmail()
  @ApiProperty({ format: 'email' })
  readonly email: string;

  @IsEnum(EmailType)
  @ApiProperty({ format: 'emailType' })
  readonly emailType: EmailType;
}
