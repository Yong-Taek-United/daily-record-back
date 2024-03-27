import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Project } from 'src/shared/entities/project.entity';
import { User } from 'src/shared/entities/user.entity';
import { Task } from 'src/shared/entities/task.entity';
import { CreateProjectDto, UpdateProjectDto, getProjectListDto } from 'src/shared/dto/project.dto';
import { ConvertDateUtility } from 'src/shared/utilities/convert-date.utility';
import { Activity } from 'src/shared/entities/activity.entity';
import { ProjectStatus } from 'src/shared/types/enums/project.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  // 프로젝트 생성 처리
  async createProject(user: User, projectData: CreateProjectDto) {
    const projectInfo = {
      ...projectData,
      user,
    };
    const data = await this.projectRepository.save(projectInfo);

    return data;
  }

  // 프로젝트 목록 조회
  async getProjectList(user: User, projectData: getProjectListDto) {
    const { projectStatus, listSkip, listTake } = projectData;
    const convertedDate = ConvertDateUtility.convertDateWithoutTime(new Date());

    const period = await this.setPeriodByProjectStatus(projectStatus, convertedDate);

    const whereOptions = {
      isCompleted: false,
      isDeleted: false,
      user: { id: user.id },
      ...period,
    };

    const data = await this.projectRepository.find({
      where: whereOptions,
      order: {
        startedAt: 'ASC',
      },
      skip: listSkip,
      take: listTake,
    });

    return data;
  }

  // 프로젝트 상세 내용 조회
  async getProjectDetail(user: User, projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, isDeleted: false },
      relations: ['user'],
    });
    if (!project) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');
    if (project.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');
    const { user: remove, ...data } = project;

    return data;
  }

  // 프로젝트 수정 처리
  async updateProject(user: User, projectId: number, projectData: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, isDeleted: false },
      relations: ['user'],
    });
    if (!project) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');
    if (project.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    await this.checkTaskPeriod(user, projectId, projectData);

    const projectInfo = {
      ...projectData,
      id: projectId,
    };
    const data = await this.projectRepository.save(projectInfo);

    return data;
  }

  // 프로젝트 삭제 처리
  async deleteProject(user: User, projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
    if (project.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const result = await this.projectRepository.update(projectId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    await this.taskRepository.update({ project: { id: projectId } }, { isDeleted: true, deletedAt: new Date() });
    await this.activityRepository.update({ project: { id: projectId } }, { project: null, task: null });

    return result;
  }

  // 나의 프로젝트 목록 조회: 액티비티 생성
  async getProjectsForActivity(user: User) {
    const convertedDate = ConvertDateUtility.convertDateWithoutTime(new Date());

    const options = {
      isCompleted: false,
      isDeleted: false,
      startedAt: LessThanOrEqual(convertedDate),
      finishedAt: MoreThanOrEqual(convertedDate),
      user: { id: user.id },
    };
    const data = await this.projectRepository.find({ where: options });

    return data;
  }

  // 조회 기간 설정 By 프로젝트 상태
  async setPeriodByProjectStatus(status: ProjectStatus, date: Date) {
    let startedAt: FindOperator<Date>;
    let finishedAt: FindOperator<Date>;

    switch (status) {
      case ProjectStatus.SCHEDULED:
        startedAt = MoreThan(date);
        finishedAt = startedAt;
        break;
      case ProjectStatus.ONGOING:
        startedAt = LessThanOrEqual(date);
        finishedAt = MoreThanOrEqual(date);
        break;
      case ProjectStatus.COMPLETED:
        startedAt = LessThan(date);
        finishedAt = startedAt;
        break;
      default:
        startedAt = LessThanOrEqual(date);
        finishedAt = MoreThanOrEqual(date);
    }

    return { startedAt, finishedAt };
  }

  // 프로젝트 기간 수정 가능 여부 확인
  async checkTaskPeriod(user: User, projectId: number, projectData: UpdateProjectDto) {
    const { startedAt, finishedAt } = projectData;

    const whereOptions = {
      isDeleted: false,
      project: { id: projectId },
      user: { id: user.id },
      startedAt: LessThan(startedAt),
      finishedAt: MoreThan(finishedAt),
    };

    const tasks = await this.taskRepository.find({ where: whereOptions });
    if (tasks.length > 0) throw new UnprocessableEntityException('이미 존재하는 과제와 기간이 어긋납니다.');
  }
}
