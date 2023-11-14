import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from 'src/shared/entities/events.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  // 이벤트 생성
  async create(eventData) {
    await this.eventsRepository.save(eventData);
    return { Success: true, statusCode: 201, message: '이벤트 생성이 완료되었습니다.' };
  }

  // 이벤트 전체 조회
  async getEvents(userId: number, dailyId: number) {
    const events = await this.eventsRepository.find({
      relations: ['works'],
      where: {
        user: { id: userId },
        daily: { id: dailyId },
      },
    });
    return { Success: true, statusCode: 201, message: '이벤트 전체 조회가 완료되었습니다.', eventData: events };
  }

  // 이벤트 개별 조회
  async getEvent(id: number) {
    const event = await this.eventsRepository.findOne({
      relations: ['works'],
      where: { id },
    });
    return { Success: true, statusCode: 201, message: '이벤트 조회가 완료되었습니다.', eventData: event };
  }

  // 이벤트 수정
  async update(id: number, eventData) {
    await this.eventsRepository.update(id, eventData);
    return { Success: true, statusCode: 200, message: '이벤트 수정이 완료되었습니다.' };
  }

  // 이벤트 삭제
  async delete(id: number) {
    await this.eventsRepository.delete(id);
    return { Success: true, statusCode: 200, message: '이벤트 삭제가 완료되었습니다.' };
  }

  // // 이벤트 체크
  // async check(id: number) {
  //   const event = await this.eventsRepository.findOne({ where: { id } });
  //   let checkValue = true;
  //   if (event.isChecked) {
  //     checkValue = false;
  //   }
  //   event.isChecked = checkValue;
  //   await this.eventsRepository.save(event);
  //   return { Success: true, statusCode: 201, message: '이벤트 체크가 완료되었습니다.', value: checkValue };
  // }

  // // 이벤트 전체 조회
  // async showCheckList(userId: number, dailyId: number, eventData) {
  //   const events = await this.eventsRepository.find({
  //     where: {
  //       user: { id: userId },
  //       daily: { id: dailyId },
  //       isChecked: eventData.checkValue,
  //     },
  //   });
  //   return { Success: true, statusCode: 201, message: '이벤트 체크 분류 조회가 완료되었습니다.', events: events };
  // }
}
