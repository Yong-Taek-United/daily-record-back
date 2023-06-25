import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DailiesService } from './dailies.service';

@Controller('dailies')
export class DailiesController {
  constructor(private readonly dailiesService: DailiesService) {}

  // 데일리 생성
  @Post()
  create(@Body() dailyData) {
    return this.dailiesService.create(dailyData);
  }

  // 데일리 전체 조회(by date)
  @Get('/getDailies/:id/:year/:month')
  getDailies(@Param('id') userId: number, @Param('year') year: number, @Param('month') month: number) {
    return this.dailiesService.getDailies(userId, year, month);
  }

  // 데일리 개별 조회(by id)
  @Get('/:id')
  getDaily(@Param('id') dailyId: number) {
    return this.dailiesService.getDaily(dailyId);
  }

  // 데일리 개별 조회(by date)
  @Get('/byDate/:userId/:year/:month/:day')
  getDailyByDate(
    @Param('userId') userId: number,
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
  ) {
    return this.dailiesService.getDailyByDate(userId, year, month, day);
  }

  // 데일리 수정
  @Patch('/:id')
  update(@Param('id') dailyId: number, @Body() dailyDate) {
    return this.dailiesService.update(dailyId, dailyDate);
  }

  // 데일리 삭제
  @Delete('/:id')
  delete(@Param('id') dailyId: number) {
    return this.dailiesService.delete(dailyId);
  }
}
