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
  @ApiOperation({ summary: '액티비티 생성', description: '액티비티를 생성합니다.' })
  async createActivity(@Req() req, @Body() activityData: createActivityDto) {
    const data = await this.activityService.createActivity(req.user, activityData);
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

  @Post('image/upload')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '액티비티 이미지 등록',
    description:
      '액티비티 이미지 등록과 수정 시 해당 메소드를 사용하며, 요청 성공 시 제공 된 activityFiles 데이터(배열)을 그대로(id가 포함된) 액티비티 등록/수정 시 함께 주셔야 합니다. 이미지 파일은 3개까지 가능합니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
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
  async uploadActivityImages(@Req() req, @UploadedFiles() files: Express.Multer.File[]) {
    const data = await this.activityService.uploadActivityImages(req.user, files);
    return { statusCode: 201, data };
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
