import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { ActivityDto } from 'src/shared/dto/activity.dto';

@Controller('activities')
@ApiTags('Activitiy')
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('')
  @ApiOperation({ summary: '액티비티 생성', description: '액티비티를 생성합니다.' })
  async createActivity(@Req() req, @Body() activityData: ActivityDto) {
    return await this.activityService.createActivity(req.user, activityData);
  }
}
