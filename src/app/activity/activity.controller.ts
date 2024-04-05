import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import {
  DeleteImageDto,
  CreateActivityDto,
  CreateActivityDto2,
  GetActivityWithProjectDto,
  UpdateActivityDto,
  UpdateActivityDto2,
  GetActivityListDto,
} from 'src/shared/dto/activity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('activities')
@ApiTags('Activitiy')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('')
  @ApiOperation({ summary: '액티비티 생성', description: '액티비티를 생성합니다.' })
  async createActivity(@Req() req, @Body() activityData: CreateActivityDto) {
    const data = await this.activityService.createActivity(req.user, activityData);
    return { statusCode: 201, data };
  }

  @Get('list/:year/:month')
  @ApiOperation({ summary: '액티비티 목록 조회: 캘린더', description: '캘린더에 사용될 액티비티 목록을 조회합니다.' })
  @ApiParam({
    name: 'year',
  })
  @ApiParam({
    name: 'month',
  })
  async getActivityList(@Req() req, @Param() getActivityListData: GetActivityListDto) {
    const data = await this.activityService.getActivityList(req.user, getActivityListData);
    return { statusCode: 200, data };
  }

  @Get(':activityId')
  @ApiOperation({ summary: '액티비티 조회', description: '액티비티를 조회합니다.' })
  @ApiParam({
    name: 'activityId',
  })
  async getActivityDetail(@Req() req, @Param('activityId') activityId: number) {
    const data = await this.activityService.getActivityDetail(req.user, activityId);
    return { statusCode: 200, data };
  }

  @Put(':activityId')
  @ApiOperation({ summary: '액티비티 수정', description: '액티비티를 수정합니다.' })
  @ApiParam({
    name: 'activityId',
  })
  async updateActivity(@Req() req, @Param('activityId') activityId: number, @Body() activityData: UpdateActivityDto) {
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

  @Delete('image/:activityFileIds')
  @ApiOperation({
    summary: '액티비티 이미지 삭제',
    description: '액티비티를 이미지를 삭제합니다. 여러개의 id를 쉼표로 Stringify하여 전달할 수 있습니다.("1,2,3")',
  })
  @ApiParam({
    name: 'activityFileIds',
  })
  async deleteActivityImages(@Req() req, @Param() deleteImageData: DeleteImageDto) {
    const activityFileIds = deleteImageData.arrayActivityFileIds;
    await this.activityService.deleteActivityImages(req.user, activityFileIds);
    return { statusCode: 200 };
  }

  @Post('with-image')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiOperation({
    summary: '액티비티 생성(with Images)',
    description: '액티비티를 생성합니다. 이미지는 최대 3개까지 가능합니다.',
  })
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
  async createActivityWithImages(
    @Req() req,
    @Body() activityData: CreateActivityDto2,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const data = await this.activityService.createActivityWithImages(req.user, activityData, files);
    return { statusCode: 201, data };
  }

  @Put('with-image/:activityId')
  @UseInterceptors(FilesInterceptor('files', 3))
  @ApiOperation({
    summary: '액티비티 수정(with Images)',
    description: '액티비티를 수정합니다. 이미지는 최대 3개까지 가능합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'activityId',
  })
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
  async updateActivityWithImages(
    @Req() req,
    @Param('activityId') activityId: number,
    @Body() activityData: UpdateActivityDto2,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const data = await this.activityService.updateActivityWithImages(req.user, activityId, activityData, files);
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

  @Get('logs/list/:projectId/:taskId')
  @ApiOperation({
    summary: '액티비티 목록 조회: 프로젝트/테스크',
    description: '프로젝트/테스크와 관련된 액티비티 목록을 조회합니다.',
  })
  async getActivityListWithProject(@Req() req, @Param() activityData: GetActivityWithProjectDto) {
    const data = await this.activityService.getActivityListWithProject(req.user, activityData);
    return { statusCode: 200, data };
  }
}
