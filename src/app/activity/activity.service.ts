import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from 'src/shared/entities/activity.entity';
import { User } from 'src/shared/entities/user.entity';
import { createActivityDto, updateActivityDto } from 'src/shared/dto/activity.dto';
import { Task } from 'src/shared/entities/task.entity';
import { TaskGoal } from 'src/shared/entities/taskGoal.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskGoal)
    private readonly taskGoalRepository: Repository<TaskGoal>,
  ) {}

  // 액티비티 생성 처리
  async createActivity(user: User, activityData: createActivityDto) {
    const { task, actedDate, filledGoal } = activityData;

    if (!!task) {
      await this.checkTaskPeriod(task.id, actedDate);
      await this.updateAccumulation(task.id, filledGoal);
    }

    const activityInfo = { ...activityData, user };
    const data = await this.activityRepository.save(activityInfo);

    return { statusCode: 201, data };
  }

  // 액티비티 수정 처리
  async updateActivity(user: User, activityId: number, activityData: updateActivityDto) {
    const activity = await this.activityRepository.findOne({ where: { id: activityId }, relations: ['user', 'task'] });
    if (activity.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const previousTask = activity.task;
    const previousFilledGoal = activity.filledGoal;
    const { task: newTask, actedDate, filledGoal: newFilledGoal } = activityData;

    if (!!previousTask) {
      await this.updateAccumulation(previousTask.id, -previousFilledGoal);
    }

    if (!!newTask) {
      await this.checkTaskPeriod(newTask.id, actedDate);
      await this.updateAccumulation(newTask.id, newFilledGoal);
    }

    const activityInfo = { ...activityData, id: activityId };
    const data = await this.activityRepository.save(activityInfo);

    return { statusCode: 200, data };
  }

  // 액티비티 삭제 처리
  async deleteActivity(user: User, activityId: number) {
    const activity = await this.activityRepository.findOne({ where: { id: activityId }, relations: ['user', 'task'] });
    if (!activity) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');
    if (activity.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    if (!!activity.task) await this.updateAccumulation(activity.task.id, -activity.filledGoal);

    const result = await this.activityRepository.update(activityId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    return { statusCode: 200 };
  }

  // 액티비티 일자 등록 가능 여부 확인
  async checkTaskPeriod(taskId: number, actedDate: Date) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        isDeleted: false,
      },
    });
    if (!task) throw new BadRequestException('과제가 존재하지 않습니다.');

    if (task.startedAt > actedDate || task.finishedAt < actedDate)
      throw new BadRequestException('액티비티 일자가 과제 기간을 벗어납니다.');
  }

  // 테스크 누적량 수정
  async updateAccumulation(taskId: number, filledGoal: number) {
    const taskGoal = await this.taskGoalRepository.findOne({ where: { task: { id: taskId } } });
    const accumulation = taskGoal.accumulation;
    const newAccumulation = accumulation + filledGoal;
    const result = await this.taskGoalRepository.update({ task: { id: taskId } }, { accumulation: newAccumulation });
    if (result.affected === 0) throw new InternalServerErrorException();
  }
}
