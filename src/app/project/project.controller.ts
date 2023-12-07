import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from 'src/shared/dto/project.dto';

@Controller('projects')
@ApiTags('Project')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @ApiOperation({ summary: '프로젝트 생성', description: '프로젝트와 테스크를 모두 생성합니다.' })
  async createProject(@Req() req, @Body() projectData: CreateProjectDto) {
    const userId: number = req.user.sub;
    return await this.projectService.createProject(userId, projectData);
  }
}
