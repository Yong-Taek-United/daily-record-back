import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ActivityDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '액티비티 제목을 작성합니다.' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '액티비티 내용을 작성합니다.' })
  description: string;
  @IsDateString()
  @ApiProperty({ example: '2023-10-15' })
  actedDate: Date;

  @IsNumber()
  @ApiProperty({ example: 11 })
  actedHour: number;

  @IsNumber()
  @ApiProperty({ example: 23 })
  actedMinute: number;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: object;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: object;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  task: object;
}
