import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CountType, CycleType } from '../types/enums/task.enum';

const exampleTasks = [
  {
    title: '테스크 제목을 작성해주세요.',
    description: '테스크 내용을 작성해주세요.',
    startedAt: '2023-10-15',
    finishedAt: '2023-11-14',
    category: { id: 1 },
    icon: { id: 1 },
    taskGoal: { countType: 'COUNT', cycleType: 'DAY', cycleCount: 2, goal: 62, isWeekendsExcl: true },
    taskPush: { cycleType: 'DAY', pushTime: 12, isPushEnabled: true },
  },
  {
    title: '테스크2 제목을 작성해주세요.',
    description: '테스크2 내용을 작성해주세요.',
    startedAt: '2023-11-15',
    finishedAt: '2023-12-14',
    category: { id: 1 },
    icon: { id: 1 },
    taskGoal: { countType: 'DURATION', cycleType: 'WEEK', cycleCount: 5, goal: 22, isWeekendsExcl: false },
    taskPush: { cycleType: 'DAY', pushTime: 22, isPushEnabled: true },
  },
];

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
  @ApiProperty({ example: 2 })
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
  @IsNumber()
  @ApiProperty({ example: 12 })
  pushTime: number;

  @IsBoolean()
  @ApiProperty({ example: true })
  isPushEnabled: boolean;
}

export class CreateTaskDto {
  @IsOptional()
  project: object;

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
  @ApiProperty()
  category: object;

  @IsObject()
  @ApiProperty()
  icon: object;

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

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateTaskDto)
  @ApiProperty({ example: exampleTasks })
  tasks: CreateTaskDto[];
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
