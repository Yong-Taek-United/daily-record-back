import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    create(@Body() eventData) {
        return this.eventsService.create(eventData);
    }

    @Get()
    getEvents() {
        return this.eventsService.getEvents();
    }

    @Get('/:id')
    getEvent(@Param('id') eventId: number) {
        return this.eventsService.getEvent(eventId);
    }

    @Patch('/:id')
    update(@Param('id') eventId: number, @Body() eventData) {
        return this.eventsService.update(eventId, eventData);
    }

    @Delete('/:id')
    delete(@Param('id') eventId: number) {
        return this.eventsService.delete(eventId);
    }
}
