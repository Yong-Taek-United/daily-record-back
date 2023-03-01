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
    
    // 데일리 생성
    async create(dailyData) {
        await this.dailiesRepository.save(dailyData);
        return {Success: true, statusCode: 201, message: '데일리 생성이 완료되었습니다.'};
    }

    // 데일리 전체 조회
    async getDailies(userId: number) {
        const dailies = await this.dailiesRepository.find({relations: ['events'], where: {users: {id: userId}}});
        return {Success: true, statusCode: 201, message: '데일리 전체 조회가 완료되었습니다.', dailyData: dailies};
    }

    // 데일리 개별 조회
    async getDaily(id: number) {
        const daily = await this.dailiesRepository.findOne({where: {id}});
        return {Success: true, statusCode: 201, message: '데일리 조회가 완료되었습니다.', dailyData: daily};
    }

    // 데일리 수정
    async update(id: number, dailyData) {
        await this.dailiesRepository.update(id, dailyData);
        return {Success: true, statusCode: 200, message: '데일리 수정이 완료되었습니다.'};
    }

    // 데일리 삭제
    async delete(id: number) {
        await this.dailiesRepository.delete(id);
        return {Success: true, statusCode: 200, message: '데일리 삭제가 완료되었습니다.'};
    }
}
