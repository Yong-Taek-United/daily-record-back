import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Works } from 'src/entities/works.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorksService {
    constructor(
        @InjectRepository(Works)
        private worksRepository: Repository<Works>,
        ){}
    
    // 할일 생성
    async create(workData) {
        const work = await this.worksRepository.save(workData);
        return {Success: true, statusCode: 201, message: '할일 생성이 완료되었습니다.', workData: work};
    }

    // 할일 전체 조회
    async getWorks(userId: number) {
        const works = await this.worksRepository.find({
            where: {
                users: {id: userId},
            }
        });
        return {Success: true, statusCode: 201, message: '할일 전체 조회가 완료되었습니다.', workData: works};
    }

    // 할일 전체 조회(in plan)
    async getWorksInPlan(userId: number, planId: number) {
        const works = await this.worksRepository.find({
            where: {
                users: {id: userId},
                plans: {id: planId}
            }
        });
        return {Success: true, statusCode: 201, message: '할일 전체 조회가 완료되었습니다.', workData: works};
    }

    // 할일 개별 조회
    async getWork(id: number) {
        const work = await this.worksRepository.findOne({where: {id}});
        return {Success: true, statusCode: 201, message: '할일 조회가 완료되었습니다.', workData: work};
    }

    // 할일 수정
    async update(id: number, workData) {
        await this.worksRepository.update(id, workData);
        return {Success: true, statusCode: 200, message: '할일 수정이 완료되었습니다.'};
    }

    // 할일 삭제
    async delete(id: number) {
        await this.worksRepository.delete(id);
        return {Success: true, statusCode: 200, message: '할일 삭제가 완료되었습니다.'};
    }
}
