import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DailiesService } from './dailies.service';

@Controller('dailies')
export class DailiesController {
    constructor(private readonly dailiesService: DailiesService) {}

    @Post()
    create(@Body() dailyData) {
        return this.dailiesService.create(dailyData);
    }

    @Get('/getDailies/:id')
    getDailies(@Param('id') userId: number) {
        console.log(userId)
        return this.dailiesService.getDailies(userId);
    }

    @Get('/:id')
    getDaily(@Param('id') dailyId: number) {
        return this.dailiesService.getDaily(dailyId);
    }

    @Patch('/:id')
    update(@Param('id') dailyId: number, @Body() dailyDate) {
        return this.dailiesService.update(dailyId, dailyDate);
    }

    @Delete('/:id')
    delete(@Param('id') dailyId: number) {
        return this.dailiesService.delete(dailyId);
    }
}
