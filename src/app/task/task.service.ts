import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
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

    const taskCount = await this.taskRepository.count({ where: { project: project, isDeleted: false } });
    if (taskCount > 2) throw new UnprocessableEntityException('과제는 최대 3개까지 추가할 수 있습니다.');

    const taskInfo = { ...taskData, user };
    const data = await this.taskRepository.save(taskInfo);

    return data;
  }

  // 테스크 목록 조회
  async getTaskList(user: User, projectId: number) {
    const tasks = await this.taskRepository.find({
      where: { project: { id: projectId }, isDeleted: false },
      relations: ['taskGoal', 'taskPush', 'category', 'color', 'icon'],
    });

    const data = tasks.map((task) => {
      const progressData = this.calculateTaskProgress(task);
      return { ...task, progressData };
    });

    return data;
  }

  // 테스크 수정 처리
  async updateTask(user: User, taskId: number, taskData: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['user'] });
    if (task.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const { project, startedAt, finishedAt } = taskData;
    await this.checkProjectPeriod(project.id, startedAt, finishedAt);
    await this.checkAtivityPeriod(user, taskId, taskData);

    const taskInfo = { ...taskData, id: taskId };
    const data = await this.taskRepository.save(taskInfo);

    return data;
  }

  // 테스크 삭제 처리
  async deleteTask(user: User, taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId }, relations: ['user'] });
    if (task.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const result = await this.taskRepository.update(taskId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    await this.activityRepository.update({ task: { id: taskId } }, { project: null, task: null });

    return result;
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

    if (new Date(project.startedAt) > new Date(startedAt) || new Date(project.finishedAt) > new Date(finishedAt))
      throw new BadRequestException('과제 기간이 프로젝트 기간을 벗어납니다.');
  }

  // 테스크 기간 수정 가능 여부 확인(for Activity)
  async checkAtivityPeriod(user: User, taskId: number, taskData: UpdateTaskDto) {
    const { startedAt, finishedAt } = taskData;

    const whereOptions = {
      isDeleted: false,
      task: { id: taskId },
      user: { id: user.id },
      actedDate: LessThan(startedAt) || MoreThan(finishedAt),
    };

    const activitys = await this.activityRepository.find({ where: whereOptions });
    if (activitys.length > 0) throw new UnprocessableEntityException('이미 존재하는 활동 기록과 기간이 어긋납니다.');
  }

  // 나의 테스크 목록 조회: 액티비티 생성
  async getTaskForActivity(user: User, projectId: number) {
    const convertedDate = ConvertDateUtility.convertDateWithoutTime(new Date());

    const options = {
      isCompleted: false,
      isDeleted: false,
      startedAt: LessThanOrEqual(convertedDate),
      finishedAt: MoreThanOrEqual(convertedDate),
      user: { id: user.id },
      project: { id: projectId },
    };
    const data = await this.taskRepository.find({ where: options });

    return data;
  }

  // 테스크 진행도 데이터 산출
  calculateTaskProgress(task: Task) {
    const totalDays = ConvertDateUtility.calculateDaysBetweenDates(
      task.startedAt,
      task.finishedAt,
      task.taskGoal.isWeekendsExcl,
    );
    const elapsedDays = ConvertDateUtility.calculateDaysBetweenDates(
      task.startedAt,
      new Date(),
      task.taskGoal.isWeekendsExcl,
    );
    const goal = task.taskGoal.goal;
    const accumulation = task.taskGoal.accumulation;
    const expectedAccumulation = Number((goal * (elapsedDays / totalDays)).toFixed(0));
    const achivementRate = Number((accumulation / goal).toFixed(3));
    const estimatedAchivementRate = Number((accumulation / expectedAccumulation).toFixed(3));

    const progressData = {
      totalDays,
      elapsedDays,
      goal,
      accumulation,
      expectedAccumulation,
      achivementRate,
      estimatedAchivementRate,
    };
    return progressData;
  }
}
