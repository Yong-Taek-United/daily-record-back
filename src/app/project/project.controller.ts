import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from 'src/shared/dto/project.dto';

@Controller('projects')
@ApiTags('Project')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('first')
  @ApiOperation({ summary: '프로젝트 생성: 방식-1', description: '프로젝트와 테스크를 모두 생성합니다.' })
  async createProjectWithTask(@Req() req, @Body() projectData: CreateProjectDto) {
    return await this.projectService.createProjectWithTask(req.user, projectData);
  }

  @Post('second')
  @ApiOperation({ summary: '프로젝트 생성: 방식-2', description: '프로젝트를 생성합니다.' })
  async createProject(@Req() req, @Body() projectData: CreateProjectDto) {
    return await this.projectService.createProject(req.user, projectData);
  }
}
