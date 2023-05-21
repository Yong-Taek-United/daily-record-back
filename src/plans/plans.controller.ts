import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) {}

    // 계획 생성
    @Post()
    create(@Body() planData) {
        return this.plansService.create(planData);
    }

    // 계획 전체 조회
    @Get('/getPlans/:id')
    getPlans(
        @Param('id') userId: number) {
        return this.plansService.getPlans(userId);
    }

    // 계획 개별 조회
    @Get('/:id')
    getPlan(@Param('id') planId: number) {
        return this.plansService.getPlan(planId);
    }

    // 계획 수정
    @Patch('/:id')
    update(
        @Param('id') planId: number, 
        @Body() planData
        ) {
            return this.plansService.update(planId, planData);
    }

    // 계획 삭제
    @Delete('/:id')
    delete(@Param('id') planId: number) {
        return this.plansService.delete(planId);
    }
}
