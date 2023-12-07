import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDto, CreateTaskDto } from 'src/shared/dto/project.dto';
import { Project } from 'src/shared/entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // 프로젝트 생성 처리
  async createProject(userId: number, projectData: CreateProjectDto) {
    const { tasks, ...project } = projectData;
    const tasksWithUser = await this.setUserForTask(userId, tasks);
    const projectInfo = {
      ...project,
      user: { id: userId },
      tasks: tasksWithUser,
    };
    const data = await this.projectRepository.save(projectInfo);

    return { statusCode: 201, data };
  }

  // 테스크 회원 설정
  async setUserForTask(userId: number, tasks: CreateTaskDto[]) {
    return tasks.map((task) => ({ user: { id: userId }, ...task }));
  }
}
