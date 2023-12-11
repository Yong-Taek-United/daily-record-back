import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Task } from 'src/shared/entities/task.entity';
import { User } from 'src/shared/entities/user.entity';
import { CreateTaskDto, UpdateTaskDto } from 'src/shared/dto/task.dto';
import { ConvertDateUtility } from 'src/shared/utilities/convert-date.utility';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // 테스크 생성 처리: 방식-2
  async createTask(user: User, taskData: CreateTaskDto) {
    const { password, ...userInfo } = user;
    const taskInfo = {
      ...taskData,
      user: userInfo,
    };
    const data = await this.taskRepository.save(taskInfo);

    return { statusCode: 201, data };
  }

  // 테스크 수정 처리: 방식-2
  async updateTask(user: User, taskId: number, taskData: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['user'] });
    if (task.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const taskInfo = {
      ...taskData,
      id: taskId,
    };
    const data = await this.taskRepository.save(taskInfo);

    return { statusCode: 200, data };
  }

  // 테스크 삭제 처리
  async deleteTask(user: User, taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['user'] });
    if (task.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const result = await this.taskRepository.update(taskId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    return { statusCode: 200 };
  }

  // 나의 테스크 목록 조회: 액티비티 생성
  async getTaskForActivity(user: User, projectId: number) {
    const convertedDate = ConvertDateUtility.convertDateWithoutTime(new Date());

    const options = {
      isComplated: false,
      isDeleted: false,
      startedAt: LessThanOrEqual(convertedDate),
      finishedAt: MoreThanOrEqual(convertedDate),
      user: { id: user.id },
      project: { id: projectId },
    };
    const data = await this.taskRepository.find({ where: options });

    return { statusCode: 200, data };
  }
}
