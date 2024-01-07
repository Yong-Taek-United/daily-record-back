import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '프로젝트 제목을 작성해주세요.' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '프로젝트 내용을 작성해주세요.' })
  description: string;

  @IsDateString()
  @ApiProperty({ example: '2023-10-01' })
  startedAt: Date;

  @IsDateString()
  @ApiProperty({ example: '2023-12-31' })
  finishedAt: Date;

  @IsBoolean()
  @ApiProperty({ example: true })
  isActive: boolean;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '프로젝트 제목을 수정합니다.' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '프로젝트 내용을 수정합니다.' })
  description: string;

  @IsDateString()
  @ApiProperty({ example: '2023-09-01' })
  startedAt: Date;

  @IsDateString()
  @ApiProperty({ example: '2023-12-31' })
  finishedAt: Date;

  @IsBoolean()
  @ApiProperty({ example: true })
  isActive: boolean;
}
