import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from 'src/entities/events.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Events)
        private eventsRepository: Repository<Events>,
    ){}
    
    // 이벤트 생성
    async create(eventData) {
        await this.eventsRepository.save(eventData);
        return {Success: true, statusCode: 201, message: '이벤트 생성이 완료되었습니다.'};
    }

    // 이벤트 전체 조회
    async getEvents(userId:number) {
        const events = await this.eventsRepository.find({where: {users: {id: userId}}});
        return {Success: true, statusCode: 201, message: '이벤트 전체 조회가 완료되었습니다.', eventData: events};
    }

    // 이벤트 개별 조회
    async getEvent(id: number) {
        const event = await this.eventsRepository.findOne({where: {id}});
        return {Success: true, statusCode: 201, message: '이벤트 조회가 완료되었습니다.', eventData: event};
    }

    // 이벤트 수정
    async update(id: number, eventData) {
        await this.eventsRepository.update(id, eventData);
        return {Success: true, statusCode: 200, message: '이벤트 수정이 완료되었습니다.'};
    }

    // 이벤트 삭제
    async delete(id: number) {
        await this.eventsRepository.delete(id);
        return {Success: true, statusCode: 200, message: '이벤트 삭제가 완료되었습니다.'};
    }
}
