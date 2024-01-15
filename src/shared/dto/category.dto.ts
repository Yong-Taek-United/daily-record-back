import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ example: '취미' })
  name: string;
}

export class UpdateCategoryDto {
  @IsString()
  @ApiProperty({ example: '일상' })
  name: string;
}
