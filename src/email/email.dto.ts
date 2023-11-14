import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @ApiProperty({ format: 'email' })
  readonly email: string;
}
