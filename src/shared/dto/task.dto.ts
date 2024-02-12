import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CountType, CycleType } from '../types/enums/task.enum';
import { Project } from '../entities/project.entity';
import { Category } from '../entities/category.entity';
import { Color } from '../entities/color.entity';
import { Icon } from '../entities/icon.entity';

export class CreateTaskGoalDto {
  @IsString()
  @ApiProperty({ example: CountType.COUNT })
  countType: CountType;

  @IsString()
  @ApiProperty({ example: CycleType.DAY })
  cycleType: CycleType;

  @IsNumber()
  @ApiProperty({ example: 2 })
  cycleCount: number;

  @IsNumber()
  @ApiProperty({ example: 62 })
  goal: number;

  @IsBoolean()
  @ApiProperty({ example: false })
  isWeekendsExcl: boolean;
}

export class CreateTaskPushDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: CycleType.DAY })
  cycleType: CycleType;

  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @ApiProperty({ example: '12:00' })
  pushTime: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  isPushEnabled: boolean;
}

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '테스크 제목을 작성해주세요.' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '테스크 내용을 작성해주세요.' })
  description: string;

  @IsDateString()
  @ApiProperty({ example: '2023-10-15' })
  startedAt: Date;

  @IsDateString()
  @ApiProperty({ example: '2023-11-14' })
  finishedAt: Date;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: Project;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: Category;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  color: Color;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  icon: Icon;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateTaskGoalDto)
  @ApiProperty()
  taskGoal: CreateTaskGoalDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateTaskPushDto)
  @ApiProperty()
  taskPush: CreateTaskPushDto;
}

export class UpdateTaskGoalDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsString()
  @ApiProperty({ example: CountType.COUNT })
  countType: CountType;

  @IsString()
  @ApiProperty({ example: CycleType.DAY })
  cycleType: CycleType;

  @IsNumber()
  @ApiProperty({ example: 2 })
  cycleCount: number;

  @IsNumber()
  @ApiProperty({ example: 62 })
  goal: number;

  @IsBoolean()
  @ApiProperty({ example: false })
  isWeekendsExcl: boolean;
}

export class UpdateTaskPushDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: CycleType.DAY })
  cycleType: CycleType;

  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  @ApiProperty({ example: '10:00' })
  pushTime: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  isPushEnabled: boolean;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '테스크 제목을 수정합니다.' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '테스크 내용을 수정합니다.' })
  description: string;

  @IsDateString()
  @ApiProperty({ example: '2023-09-15' })
  startedAt: Date;

  @IsDateString()
  @ApiProperty({ example: '2023-11-14' })
  finishedAt: Date;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: Project;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: Category;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  color: Color;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  icon: Icon;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateTaskGoalDto)
  @ApiProperty()
  taskGoal: UpdateTaskGoalDto;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateTaskPushDto)
  @ApiProperty()
  taskPush: UpdateTaskPushDto;
}
