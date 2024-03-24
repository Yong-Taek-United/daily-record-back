import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsNumberString, IsObject, IsOptional, IsString, Matches } from 'class-validator';
import { Category } from '../entities/category.entity';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Transform } from 'class-transformer';

export class createActivityDto {
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

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @ApiProperty({ example: '10:22' })
  actedTime: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiProperty({ example: 1 })
  filledGoal: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: Category;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: Project;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  task: Task;
}

export class updateActivityDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '액티비티 제목을 수정합니다.' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '액티비티 내용을 수정합니다.' })
  description: string;
  @IsDateString()
  @ApiProperty({ example: '2023-11-15' })
  actedDate: Date;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @ApiProperty({ example: '10:22' })
  actedTime: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiProperty({ example: 1 })
  filledGoal: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: Category;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: Project;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  task: Task;
}

export class getActivityWithProjectDto {
  @IsNumberString()
  @ApiProperty({ example: 1 })
  projectId: number;

  @IsNumberString()
  @ApiProperty({ example: 1, description: '전체: 0' })
  taskId: number;
}
