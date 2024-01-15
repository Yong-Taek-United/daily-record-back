import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Task } from 'src/shared/entities/task.entity';
import { User } from 'src/shared/entities/user.entity';
import { CreateTaskDto, UpdateTaskDto } from 'src/shared/dto/task.dto';
import { ConvertDateUtility } from 'src/shared/utilities/convert-date.utility';
import { Activity } from 'src/shared/entities/activity.entity';
import { Project } from 'src/shared/entities/project.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  // 테스크 생성 처리
  async createTask(user: User, taskData: CreateTaskDto) {
    const { project, startedAt, finishedAt } = taskData;
    await this.checkProjectPeriod(project.id, startedAt, finishedAt);

    const taskInfo = { ...taskData, user };
    const data = await this.taskRepository.save(taskInfo);

    return { statusCode: 201, data };
  }

  // 테스크 수정 처리
  async updateTask(user: User, taskId: number, taskData: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['user'] });
    if (task.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const { project, startedAt, finishedAt } = taskData;
    await this.checkProjectPeriod(project.id, startedAt, finishedAt);

    const taskInfo = { ...taskData, id: taskId };
    const data = await this.taskRepository.save(taskInfo);

    return { statusCode: 200, data };
  }

  // 테스크 삭제 처리
  async deleteTask(user: User, taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['user'] });
    if (task.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const result = await this.taskRepository.update(taskId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    await this.activityRepository.update({ task: { id: taskId } }, { project: null, task: null });

    return { statusCode: 200 };
  }

  // 테스크 기간 등록 가능 여부 확인
  async checkProjectPeriod(projectId: number, startedAt: Date, finishedAt: Date) {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        isDeleted: false,
      },
    });
    if (!project) throw new BadRequestException('프로젝트가 존재하지 않습니다.');

    if (project.startedAt > startedAt || project.finishedAt < finishedAt)
      throw new BadRequestException('과제 기간이 프로젝트 기간을 벗어납니다.');
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
