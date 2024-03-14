import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { createActivityDto, getActivityWithProjectDto, updateActivityDto } from 'src/shared/dto/activity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('activities')
@ApiTags('Activitiy')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiOperation({ summary: '액티비티 생성', description: '액티비티를 생성합니다. 이미지는 최대 3개까지 가능합니다.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: '액티비티 제목을 작성합니다.',
        },
        description: {
          type: 'string',
          example: '액티비티 내용을 작성합니다.',
        },
        actedDate: {
          type: 'string',
          format: 'date',
          example: '2023-10-15',
        },
        actedTime: {
          type: 'string',
          example: '10:22',
        },
        filledGoal: {
          type: 'number',
          example: 1,
        },
        category: {
          type: 'object',
          example: { id: 1 },
        },
        project: {
          type: 'object',
          example: { id: 1 },
        },
        task: {
          type: 'object',
          example: { id: 1 },
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async createActivity(
    @Req() req,
    @Body() activityData: createActivityDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const data = await this.activityService.createActivity(req.user, activityData, files);
    return { statusCode: 201, data };
  }

  @Put(':activityId')
  @ApiOperation({ summary: '액티비티 수정', description: '액티비티를 수정합니다.' })
  @ApiParam({
    name: 'activityId',
  })
  async updateActivity(@Req() req, @Param('activityId') activityId: number, @Body() activityData: updateActivityDto) {
    const data = await this.activityService.updateActivity(req.user, activityId, activityData);
    return { statusCode: 200, data };
  }

  @Delete(':activityId')
  @ApiOperation({ summary: '액티비티 삭제', description: '액티비티를 삭제합니다.' })
  @ApiParam({
    name: 'activityId',
  })
  async deleteActivity(@Req() req, @Param('activityId') activityId: number) {
    await this.activityService.deleteActivity(req.user, activityId);
    return { statusCode: 200 };
  }

  @Get('list/:projectId/:taskId')
  @ApiOperation({
    summary: '액티비티 목록 조회: 프로젝트/테스크',
    description: '프로젝트/테스크와 관련된 액티비티 목록을 조회합니다.',
  })
  async getActivityListWithProject(@Req() req, @Param() activityData: getActivityWithProjectDto) {
    const data = await this.activityService.getActivityListWithProject(req.user, activityData);
    return { statusCode: 200, data };
  }
}
