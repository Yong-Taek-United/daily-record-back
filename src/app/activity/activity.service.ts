import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from 'src/shared/entities/activity.entity';
import { User } from 'src/shared/entities/user.entity';
import { ActivityDto } from 'src/shared/dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  // 액티비티 생성
  async createActivity(user: User, activityData: ActivityDto) {
    const { password, ...userInfo } = user;

    const activityInfo = {
      ...activityData,
      user: userInfo,
    };

    const data = await this.activityRepository.save(activityInfo);

    return { statusCode: 201, data };
  }
}
