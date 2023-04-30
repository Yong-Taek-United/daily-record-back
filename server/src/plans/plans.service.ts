import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from 'src/entities/plans.entity';
import { Repository } from 'typeorm';


@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plans)
        private plansRepository: Repository<Plans>,
        ){}
    
    // 계획 생성
    async create(planData) {
        const plan = await this.plansRepository.save(planData);
        return {Success: true, statusCode: 201, message: '계획 생성이 완료되었습니다.', planData: plan};
    }

    // 계획 전체 조회
    async getPlans(userId: number) {
        const plans = await this.plansRepository.find({
            relations: ['works'], 
            where: {
                users: {id: userId},
            }
        });
        return {Success: true, statusCode: 201, message: '계획 전체 조회가 완료되었습니다.', planData: plans};
    }

    // 계획 개별 조회
    async getPlan(id: number) {
        const plan = await this.plansRepository.findOne({where: {id}});
        return {Success: true, statusCode: 201, message: '계획 조회가 완료되었습니다.', planData: plan};
    }

    // 계획 수정
    async update(id: number, planData) {
        await this.plansRepository.update(id, planData);
        return {Success: true, statusCode: 200, message: '계획 수정이 완료되었습니다.'};
    }

    // 계획 삭제
    async delete(id: number) {
        await this.plansRepository.delete(id);
        return {Success: true, statusCode: 200, message: '계획 삭제가 완료되었습니다.'};
    }
}
