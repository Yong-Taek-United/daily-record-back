import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Task } from 'src/shared/entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from 'src/shared/dto/task.dto';

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
}
