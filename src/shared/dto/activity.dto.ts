import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Category } from '../entities/category.entity';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Transform } from 'class-transformer';
import { ActivityFile } from '../entities/activityFile.entity';

export class CreateActivityDto {
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
  @IsNumber()
  @ApiProperty({ example: 1 })
  filledGoal: number;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: Category;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: Project;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  task: Task;

  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [{ id: 1 }] })
  activityFiles: ActivityFile[];
}

export class UpdateActivityDto {
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
  @IsNumber()
  @ApiProperty({ example: 1 })
  filledGoal: number;

  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  category: Category;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  project: Project;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { id: 1 } })
  task: Task;

  @IsOptional()
  @IsArray()
  @ApiProperty({ example: [{ id: 1 }] })
  activityFiles: ActivityFile[];
}

export class GetActivityWithProjectDto {
  @IsNumberString()
  @ApiProperty({ example: 1 })
  projectId: number;

  @IsNumberString()
  @ApiProperty({ example: 1, description: '전체: 0' })
  taskId: number;
}

export class CreateActivityDto2 {
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

export class UpdateActivityDto2 {
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

export class DeleteImageDto {
  @IsString()
  @Matches(/^[0-9]+(,[0-9]+)*$/)
  activityFileIds: string;

  get arrayActivityFileIds(): number[] {
    return this.activityFileIds.split(',').map(Number);
  }
}

export class GetActivityListDto {
  @IsString()
  @Matches(/^\d{4}$/)
  @ApiProperty({ example: 2024 })
  year: number;

  @IsString()
  @Matches(/^(0?[1-9]|1[012])$/)
  @ApiProperty({ example: 5 })
  month: number;
}

// [
//   {
//     actedDate: "2024-04-01",
//     data: [
//       {
//         "id": 13,
//         "actedTime": "10:22",
//         "filledGoal": 1,
//         "isDeleted": 0,
//         "createdAt": "2024-04-03T12:40:49.883Z",
//         "updatedAt": "2024-04-03T12:40:49.883Z",
//         "deletedAt": null,
//         "user": {
//       },
//       {
//         "id": 13,
//         "actedTime": "10:22",
//         "filledGoal": 1,
//         "isDeleted": 0,
//         "createdAt": "2024-04-03T12:40:49.883Z",
//         "updatedAt": "2024-04-03T12:40:49.883Z",
//         "deletedAt": null,
//         "user": {
//       }
//     ]
//   },
//   {
//     actedDate: "2024-04-02",
//     activities: [
//       {
//         "id": 61,
//         "title": "액티비티 제목을 작성합니다.",
//         "description": "액티비티 내용을 작성합니다.",
//         "actedDate": "2024-04-05",
//         "actedTime": "10:22",
//         "filledGoal": 1,
//         "isDeleted": 0,
//         "createdAt": "2024-04-03T12:40:49.883Z",
//         "updatedAt": "2024-04-03T12:40:49.883Z",
//         "deletedAt": null,
//         "category": {
//           "id": 1,
//           "name": "건강",
//           "isActive": 1,
//           "createdAt": "2023-12-07T13:02:18.289Z",
//           "updatedAt": "2023-12-07T13:02:18.289Z"
//         },
//         "project": {
//           "id": 13,
//           "title": "프로젝트 제목을 작성해주세요.",
//           "description": "프로젝트 내용을 작성해주세요.",
//           "startedAt": "2024-03-12",
//           "finishedAt": "2024-04-11",
//           "isActive": 1,
//           "isCompleted": 0,
//           "isDeleted": 0,
//           "createdAt": "2024-03-31T13:31:00.895Z",
//           "updatedAt": "2024-04-02T12:02:40.480Z",
//           "deletedAt": null
//         },
//         "task": {
//           "id": 28,
//           "title": "테스크 제목을 작성해주세요.",
//           "description": "테스크 내용을 작성해주세요.",
//           "startedAt": "2024-03-12",
//           "finishedAt": "2024-04-11",
//           "isActive": 1,
//           "isCompleted": 0,
//           "isDeleted": 0,
//           "createdAt": "2024-04-02T12:03:22.163Z",
//           "updatedAt": "2024-04-02T12:03:22.163Z",
//           "deletedAt": null,
//           "taskGoal": {
//             "id": 24,
//             "cycleType": "DAY",
//             "countType": "COUNT",
//             "cycleCount": 2,
//             "goal": 62,
//             "accumulation": 8,
//             "isWeekendsExcl": 0,
//             "isActive": 1,
//             "isCompleted": 0,
//             "createdAt": "2024-04-02T12:03:22.170Z",
//             "updatedAt": "2024-04-05T07:10:34.000Z"
//           },
//           "color": {
//             "id": 1,
//             "colorCode": "DFB1B1",
//             "isActive": 1,
//             "createdAt": "2024-01-14T13:55:35.558Z",
//             "updatedAt": "2024-01-14T13:55:35.558Z"
//           },
//           "icon": {
//             "id": 1,
//             "iconType": "TASK",
//             "iconName": "runner",
//             "isActive": 1,
//             "createdAt": "2023-12-07T13:03:18.701Z",
//             "updatedAt": "2024-01-15T16:19:09.000Z"
//           }
//         },
//         "activityFile": [
//           {
//             "id": 53,
//             "seqNo": 0,
//             "filePath": "/etc/1",
//             "fileName": "img-asDLtkV08q_20240403214049.png",
//             "mimeType": "image/png",
//             "fileSize": 71680,
//             "isDeleted": 0,
//             "createdAt": "2024-04-03T12:40:49.893Z",
//             "updatedAt": "2024-04-03T12:40:49.893Z",
//             "deletedAt": null
//           }
//         ]
//       },
//     ]
//   },
//   {

//   }
// ]
