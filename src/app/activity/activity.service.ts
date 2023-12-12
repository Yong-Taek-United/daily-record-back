import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from 'src/shared/entities/activity.entity';
import { User } from 'src/shared/entities/user.entity';
import { createActivityDto, updateActivityDto } from 'src/shared/dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  // 액티비티 생성 처리
  async createActivity(user: User, activityData: createActivityDto) {
    const { password, ...userInfo } = user;

    const activityInfo = {
      ...activityData,
      user: userInfo,
    };

    const data = await this.activityRepository.save(activityInfo);

    return { statusCode: 201, data };
  }

  // 액티비티 수정 처리
  async updateActivity(user: User, activityId: number, activityData: updateActivityDto) {
    const activity = await this.activityRepository.findOne({ where: { id: activityId }, relations: ['user'] });
    if (activity.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const activityInfo = {
      ...activityData,
      id: activityId,
    };

    const data = await this.activityRepository.save(activityInfo);

    return { statusCode: 200, data };
  }

  // 액티비티 삭제 처리
  async deleteActivity(user: User, activityId: number) {
    const activity = await this.activityRepository.findOne({ where: { id: activityId }, relations: ['user'] });
    if (activity.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const result = await this.activityRepository.update(activityId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    return { statusCode: 200 };
  }
}
