import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Activity } from 'src/shared/entities/activity.entity';
import { User } from 'src/shared/entities/user.entity';
import { Task } from 'src/shared/entities/task.entity';
import { TaskGoal } from 'src/shared/entities/taskGoal.entity';
import { ActivityFile } from 'src/shared/entities/activityFile.entity';
import {
  CreateActivityDto,
  CreateActivityDto2,
  GetActivityWithProjectDto,
  UpdateActivityDto,
  UpdateActivityDto2,
} from 'src/shared/dto/activity.dto';
import { ConfigService } from '@nestjs/config';
import { FileStorageType } from 'src/shared/types/enums/file.enum';

@Injectable()
export class ActivityService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskGoal)
    private readonly taskGoalRepository: Repository<TaskGoal>,
    @InjectRepository(ActivityFile)
    private readonly activityFileRepository: Repository<ActivityFile>,
  ) {}

  // 액티비티 생성 처리
  async createActivity(user: User, activityData: CreateActivityDto) {
    const { task, actedDate, filledGoal } = activityData;

    if (!!task) {
      await this.checkTaskPeriod(task.id, actedDate);
      await this.updateAccumulation(task.id, filledGoal);
    }

    const { activityFiles, ...activityInfo } = activityData;

    const data = await this.activityRepository.save({ ...activityInfo, user });

    if (!!activityFiles) this.linkArticleAsForeignKey(data, activityFiles);

    return data;
  }

  // 액티비티 생성 처리(with Images)
  async createActivityWithImages(user: User, activityData: CreateActivityDto2, files: Express.Multer.File[]) {
    const { task, actedDate, filledGoal } = activityData;

    if (!!task) {
      await this.checkTaskPeriod(task.id, actedDate);
      await this.updateAccumulation(task.id, filledGoal);
    }

    const data = await this.activityRepository.save({ ...activityData, user });
    this.uploadActivityImages(user, files, data);

    return data;
  }

  // 액티비티 조회 처리
  async getActivity(user: User, activityId: number) {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['user', 'project', 'task.taskGoal', 'task.category', 'task.color', 'task.icon', 'activityFile'],
    });
    if (!activity) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');
    if (activity.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    return activity;
  }

  // 액티비티 수정 처리
  async updateActivity(user: User, activityId: number, activityData: UpdateActivityDto) {
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

    const { activityFiles, ...activityInfo } = activityData;

    const data = await this.activityRepository.save({ ...activityInfo, id: activityId });

    if (!!activityFiles) this.linkArticleAsForeignKey(data, activityFiles);

    return data;
  }

  // 액티비티 수정 처리(with Images)
  async updateActivityWithImages(
    user: User,
    activityId: number,
    activityData: UpdateActivityDto2,
    files: Express.Multer.File[],
  ) {
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

    const data = await this.activityRepository.save({ ...activityData, id: activityId });

    await this.activityFileRepository.update(
      { activity: { id: activityId }, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
    );

    await this.uploadActivityImages(user, files, data);

    return data;
  }

  // 액티비티 이미지 등록 처리
  async uploadActivityImages(user: User, files: Express.Multer.File[], activity?: Activity) {
    const fileRootDirectory = this.configService.get<string>('FILE_STORAGE_PATH');

    const fileInfo = files.map((file, index) => ({
      seqNo: index,
      fileStorageType: FileStorageType.DISK,
      filePath: file.destination.replace(fileRootDirectory, ''),
      fileName: file.filename,
      mimeType: file.mimetype,
      fileSize: file.size,
      activity: activity,
    }));

    const data = await this.activityFileRepository.save(fileInfo);

    return data;
  }

  // 액티비티 이미지 삭제 처리
  async deleteActivityImages(user: User, activityFileIds: number[]) {
    const activityFiles = await this.activityFileRepository.find({
      where: { id: In(activityFileIds) },
      relations: ['activity.user'],
    });
    if (!activityFiles) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');

    for (const activityFile of activityFiles) {
      const activityUserId = activityFile.activity.user.id;
      if (activityUserId !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');
    }

    const result = await this.activityFileRepository.update(
      { id: In(activityFileIds) },
      { isDeleted: true, deletedAt: new Date() },
    );
    if (result.affected === 0) throw new InternalServerErrorException();

    return result;
  }

  // 액티비티 이미지 외래키 연결
  linkArticleAsForeignKey(activity: Activity, activityFiles: ActivityFile[]) {
    this.activityFileRepository.update({ id: In(activityFiles) }, { activity: activity });
  }

  // 액티비티 삭제 처리
  async deleteActivity(user: User, activityId: number) {
    const activity = await this.activityRepository.findOne({ where: { id: activityId }, relations: ['user', 'task'] });
    if (!activity) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');
    if (activity.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    if (!!activity.task) await this.updateAccumulation(activity.task.id, -activity.filledGoal);

    const result = await this.activityRepository.update(activityId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    await this.activityFileRepository.update(
      { activity: { id: activityId }, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
    );

    return result;
  }

  // 액티비티 목록 조회: 프로젝트/테스크
  async getActivityListWithProject(user: User, activityData: GetActivityWithProjectDto) {
    const { projectId, taskId } = activityData;

    const setParams = {
      userId: user.id,
      projectId,
      taskId,
      isDeleted: false,
      isActive: false,
    };

    const queryBuilder = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.activityFile', 'activityFile', 'activityFile.isDeleted = :isDeleted')
      .leftJoinAndSelect('activity.task', 'task', 'task.isDeleted = :isDeleted')
      .leftJoinAndSelect('task.color', 'color', 'color.isActive = :isActive')
      .where('activity.user.id = :userId')
      .andWhere('activity.project.id = :projectId')
      .andWhere('activity.isDeleted = :isDeleted')
      .orderBy('activity.actedDate', 'DESC');

    if (Number(taskId) !== 0) queryBuilder.andWhere('activity.task.id = :taskId');

    const data = await queryBuilder.setParameters(setParams).getMany();

    return data;
  }

  // 액티비티 일자 등록 가능 여부 확인
  async checkTaskPeriod(taskId: number, actedDate: Date) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        isDeleted: false,
      },
    });
    if (!task) throw new NotFoundException('과제가 존재하지 않습니다.');

    if (new Date(task.startedAt) > new Date(actedDate) || new Date(task.finishedAt) < new Date(actedDate))
      throw new UnauthorizedException('액티비티 일자가 과제 기간을 벗어납니다.');
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
