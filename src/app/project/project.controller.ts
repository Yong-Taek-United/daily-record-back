import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/shared/dto/project.dto';

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

  @Put(':projectId')
  @ApiOperation({ summary: '프로젝트 수정: 방식-2', description: '프로젝트를 수정합니다.' })
  @ApiParam({
    name: 'projectId',
    example: 1,
  })
  async updateProject(@Req() req, @Param('projectId') projectId: number, @Body() projectData: UpdateProjectDto) {
    return await this.projectService.updateProject(req.user, projectId, projectData);
  }

  @Get('self/list/for-activity')
  @ApiOperation({
    summary: '나의 프로젝트 목록 조회: 액티비티 생성',
    description: '액티비티 생성 시 연결할 현재 활성화 중인 프로젝트 목록을 조회합니다.',
  })
  async getProjectsForActivity(@Req() req) {
    return await this.projectService.getProjectsForActivity(req.user);
  }
}
