import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { createActivityDto, getActivityWithProjectDto, updateActivityDto } from 'src/shared/dto/activity.dto';

@Controller('activities')
@ApiTags('Activitiy')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('')
  @ApiOperation({ summary: '액티비티 생성', description: '액티비티를 생성합니다.' })
  async createActivity(@Req() req, @Body() activityData: createActivityDto) {
    return await this.activityService.createActivity(req.user, activityData);
  }

  @Put(':activityId')
  @ApiOperation({ summary: '액티비티 수정', description: '액티비티를 수정합니다.' })
  @ApiParam({
    name: 'activityId',
  })
  async updateActivity(@Req() req, @Param('activityId') activityId: number, @Body() activityData: updateActivityDto) {
    return await this.activityService.updateActivity(req.user, activityId, activityData);
  }

  @Delete(':activityId')
  @ApiOperation({ summary: '액티비티 삭제', description: '액티비티를 삭제합니다.' })
  @ApiParam({
    name: 'activityId',
  })
  async deleteActivity(@Req() req, @Param('activityId') activityId: number) {
    return await this.activityService.deleteActivity(req.user, activityId);
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
