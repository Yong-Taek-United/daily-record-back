import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    // 프로젝트 생성
    @Post()
    create(@Body() projectData) {
        return this.projectsService.create(projectData);
    }

    // 프로젝트 전체 조회
    @Get('/getprojects/:id')
    getprojects(
        @Param('id') userId: number) {
        return this.projectsService.getProjects(userId);
    }

    // 프로젝트 개별 조회
    @Get('/:id')
    getproject(@Param('id') projectId: number) {
        return this.projectsService.getProject(projectId);
    }

    // 프로젝트 수정
    @Patch('/:id')
    update(
        @Param('id') projectId: number, 
        @Body() projectData
        ) {
            return this.projectsService.update(projectId, projectData);
    }

    // 프로젝트 삭제
    @Delete('/:id')
    delete(@Param('id') projectId: number) {
        return this.projectsService.delete(projectId);
    }
}
