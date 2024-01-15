import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @ApiProperty({ example: '000000' })
  colorCode: string;
}

export class UpdateColorDto {
  @IsString()
  @ApiProperty({ example: '626262' })
  colorCode: string;
}
