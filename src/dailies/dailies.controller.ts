import { Body, Controller, Post } from '@nestjs/common';
import { DailiesService } from './dailies.service';

@Controller('dailies')
export class DailiesController {
    constructor(private readonly dailiesService: DailiesService) {}

    @Post()
    create(@Body() dailyData) {
        return this.dailiesService.create(dailyData);
    }

}
