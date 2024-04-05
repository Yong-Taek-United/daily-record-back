import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto, GetProjectListDto } from 'src/shared/dto/project.dto';

@Controller('projects')
@ApiTags('Project')
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @ApiOperation({ summary: '프로젝트 생성', description: '프로젝트를 생성합니다.' })
  async createProject(@Req() req, @Body() projectData: CreateProjectDto) {
    const data = await this.projectService.createProject(req.user, projectData);
    return { statusCode: 201, data };
  }

  @Get('list')
  @ApiOperation({
    summary: '프로젝트 목록 조회',
    description: '프로젝트 목록을 조회합니다. 프로젝트 기간에 따라 상태를 다르게 분류합니다.',
  })
  async getProjectList(@Req() req, @Query() projectData: GetProjectListDto) {
    const data = await this.projectService.getProjectList(req.user, projectData);
    return { statusCode: 200, data };
  }

  @Get(':projectId')
  @ApiOperation({
    summary: '프로젝트 상세 내용 조회',
    description: '프로젝트 상세 내용을 조회합니다. 프로젝트 수정 시 사용합니다.',
  })
  async getProjectDetail(@Req() req, @Param('projectId') projectId: number,) {
    const data = await this.projectService.getProjectDetail(req.user, projectId);
    return { statusCode: 200, data };
  }

  @Put(':projectId')
  @ApiOperation({ summary: '프로젝트 수정', description: '프로젝트를 수정합니다.' })
  @ApiParam({
    name: 'projectId',
    example: 1,
  })
  async updateProject(@Req() req, @Param('projectId') projectId: number, @Body() projectData: UpdateProjectDto) {
    const data = await this.projectService.updateProject(req.user, projectId, projectData);
    return { statusCode: 200, data };
  }

  @Delete(':projectId')
  @ApiOperation({
    summary: '프로젝트 삭제',
    description: '프로젝트와 하위 모든 테스크를 삭제하고 연결된 액티비티 관계를 해제(null)합니다.',
  })
  @ApiParam({
    name: 'projectId',
    example: 1,
  })
  async deleteProject(@Req() req, @Param('projectId') projectId: number) {
    const data = await this.projectService.deleteProject(req.user, projectId);
    return { statusCode: 200, data };
  }

  @Get('self/list/for-activity')
  @ApiOperation({
    summary: '나의 프로젝트 목록 조회: 액티비티 생성',
    description: '액티비티 생성 시 연결할 현재 활성화 중인 프로젝트 목록을 조회합니다.',
  })
  async getProjectsForActivity(@Req() req) {
    const data = await this.projectService.getProjectsForActivity(req.user);
    return { statusCode: 200, data };
  }
}
