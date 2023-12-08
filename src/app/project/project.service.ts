import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto, CreateTaskDto } from 'src/shared/dto/project.dto';
import { Project } from 'src/shared/entities/project.entity';
import { User } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // 프로젝트 생성 처리: 방식-1
  async createProjectWithTask(user: User, projectData: CreateProjectDto) {
    const { password, ...userInfo } = user;
    const { tasks, ...project } = projectData;
    const tasksWithUser = await this.setUserForTask(userInfo, tasks);
    const projectInfo = {
      ...project,
      user: userInfo,
      tasks: tasksWithUser,
    };
    const data = await this.projectRepository.save(projectInfo);

    return { statusCode: 201, data };
  }

  // 테스크 회원 설정
  async setUserForTask(userInfo: any, tasks: CreateTaskDto[]) {
    return tasks.map((task) => ({ user: userInfo, ...task }));
  }

  // 프로젝트 생성 처리: 방식-2
  async createProject(user: User, projectData: CreateProjectDto) {
    const { password, ...userInfo } = user;
    const { tasks, ...project } = projectData;
    const projectInfo = {
      ...project,
      user: userInfo,
    };
    const data = await this.projectRepository.save(projectInfo);

    return { statusCode: 201, data };
  }
}
