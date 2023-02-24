import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dailies } from 'src/entities/dailies.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DailiesService {
    constructor(
        @InjectRepository(Dailies)
        private dailiesRepository: Repository<Dailies>,
        ){}

        async create(dailyData) {
            await this.dailiesRepository.save(dailyData);
            return {Success: true, statusCode: 201, message: '데일리 생성이 완료되었습니다.'};
        }
    
}
