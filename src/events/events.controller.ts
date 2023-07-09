import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // 이벤트 생성
  @Post()
  create(@Body() eventData) {
    return this.eventsService.create(eventData);
  }

  // 이벤트 전체 조회
  @Get('/getEvents/:userId/:dailyId')
  getEvents(@Param('userId') userId: number, @Param('dailyId') dailyId: number) {
    return this.eventsService.getEvents(userId, dailyId);
  }

  // 이벤트 개별 조회
  @Get('/:id')
  getEvent(@Param('id') eventId: number) {
    return this.eventsService.getEvent(eventId);
  }

  // 이벤트 수정
  @Patch('/:id')
  update(@Param('id') eventId: number, @Body() eventData) {
    return this.eventsService.update(eventId, eventData);
  }

  // 이벤트 삭제
  @Delete('/:id')
  delete(@Param('id') eventId: number) {
    return this.eventsService.delete(eventId);
  }

  // 이벤트 체크
  @Patch('/check/:eventId')
  check(@Param('eventId') eventId: number) {
    return this.eventsService.check(eventId);
  }

  // 이벤트 체크 분류 조회
  @Post('/check/:userId/:dailyId')
  showCheckList(@Param('userId') userId: number, @Param('dailyId') dailyId: number, @Body() eventData) {
    return this.eventsService.showCheckList(userId, dailyId, eventData);
  }
}
