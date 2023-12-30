import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Project } from 'src/shared/entities/project.entity';
import { User } from 'src/shared/entities/user.entity';
import { Task } from 'src/shared/entities/task.entity';
import { CreateProjectDto, CreateTaskDto, UpdateProjectDto } from 'src/shared/dto/project.dto';
import { ConvertDateUtility } from 'src/shared/utilities/convert-date.utility';
import { Activity } from 'src/shared/entities/activity.entity';

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
    const { password, ...userInfo } = user;
    const projectInfo = {
      ...projectData,
      user: userInfo,
    };
    const data = await this.projectRepository.save(projectInfo);

    return { statusCode: 201, data };
  }

  // 프로젝트 수정 처리
  async updateProject(user: User, projectId: number, projectData: UpdateProjectDto) {
    const project = await this.projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
    if (project.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const projectInfo = {
      ...projectData,
      id: projectId,
    };
    const data = await this.projectRepository.save(projectInfo);

    return { statusCode: 200, data };
  }

  // 프로젝트 삭제 처리
  async deleteProject(user: User, projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
    if (project.user.id !== user.id) throw new ForbiddenException('접근 권한이 없습니다.');

    const result = await this.projectRepository.update(projectId, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    await this.taskRepository.update({ project: { id: projectId } }, { isDeleted: true, deletedAt: new Date() });
    await this.activityRepository.update({ project: { id: projectId } }, { project: null, task: null });

    return { statusCode: 200 };
  }

  // 나의 프로젝트 목록 조회: 액티비티 생성
  async getProjectsForActivity(user: User) {
    const convertedDate = ConvertDateUtility.convertDateWithoutTime(new Date());

    const options = {
      isComplated: false,
      isDeleted: false,
      startedAt: LessThanOrEqual(convertedDate),
      finishedAt: MoreThanOrEqual(convertedDate),
      user: { id: user.id },
    };
    const data = await this.projectRepository.find({ where: options });

    return { statusCode: 200, data };
  }
}
