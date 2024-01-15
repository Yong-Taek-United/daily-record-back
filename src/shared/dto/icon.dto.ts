import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IconType } from '../types/enums/file.enum';

export class CreateIconDto {
  @IsString()
  @ApiProperty({ example: IconType.TASK })
  iconType: string;

  @IsString()
  @ApiProperty({ example: 'plus' })
  iconName: string;
}

export class UpdateIconDto {
  @IsString()
  @ApiProperty({ example: IconType.TASK })
  iconType: IconType;

  @IsString()
  @ApiProperty({ example: 'minus' })
  iconName: string;
}
