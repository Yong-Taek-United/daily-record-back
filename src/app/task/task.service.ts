import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Task } from 'src/shared/entities/task.entity';
import { CreateTaskDto } from 'src/shared/dto/task.dto';

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
}
