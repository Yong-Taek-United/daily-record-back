import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WorksService } from './works.service';

@Controller('works')
export class WorksController {
    constructor(private readonly worksService: WorksService) {}

    // 할일 생성
    @Post()
    create(@Body() workData) {
        return this.worksService.create(workData);
    }

    // 할일 전체 조회
    @Get('/getWorks/:id')
    getWorks(
        @Param('id') userId: number) {
        return this.worksService.getWorks(userId);
    }
    // 할일 전체 조회(in plan)
    @Get('/getWorksInPlan/:userId/:planId')
    getWorksInPlan(
        @Param('userId') userId: number, 
        @Param('planId') planId: number) {
        return this.worksService.getWorksInPlan(userId, planId);
    }

    // 할일 개별 조회
    @Get('/:id')
    getWork(@Param('id') workId: number) {
        return this.worksService.getWork(workId);
    }

    // 할일 수정
    @Patch('/:id')
    update(
        @Param('id') workId: number, 
        @Body() workData
        ) {
            return this.worksService.update(workId, workData);
    }

    // 할일 삭제
    @Delete('/:id')
    delete(@Param('id') workId: number) {
        return this.worksService.delete(workId);
    }
}
