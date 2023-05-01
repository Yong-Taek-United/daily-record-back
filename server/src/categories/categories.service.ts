import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,
    ){}

    // 카테고리 생성
    async create(categoryData) {
        await this.categoriesRepository.save(categoryData);
        return {Success: true, statusCode: 201, message: '카테고리 생성이 완료되었습니다.'};
    }

    // 카테고리 전체 조회
    async getCategories() {
        const categories = await this.categoriesRepository.find();
        return {Success: true, statusCode: 201, message: '카테고리 전체 조회가 완료되었습니다.', categoryData: categories};
    }

    // 카테고리 개별 조회
    async getCategory(id: number) {
        const category = await this.categoriesRepository.findOne({where: {id}});
        return {Success: true, statusCode: 201, message: '카테고리 조회가 완료되었습니다.', categoryData: category};
    }

    // 카테고리 수정
    async update(id: number, categoryData) {
        await this.categoriesRepository.update(id, categoryData);
        return {Success: true, statusCode: 200, message: '카테고리 수정이 완료되었습니다.'};
    }

    // 카테고리 삭제
    async delete(id: number) {
        await this.categoriesRepository.delete(id);
        return {Success: true, statusCode: 200, message: '카테고리 삭제가 완료되었습니다.'};
    }
}
