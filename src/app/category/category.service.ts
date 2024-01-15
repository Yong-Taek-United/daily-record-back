import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/shared/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/shared/dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 카테고리 생성
  async createCategory(createData: CreateCategoryDto) {
    const data = await this.categoryRepository.save(createData);
    return { statusCode: 201, data };
  }
  // 카테고리 목록 조회
  async getCategoryList() {
    const data = await this.categoryRepository.find({ where: { isActive: true } });
    return { statusCode: 200, data };
  }
  // 카테고리 수정
  async updateCategory(categoryId: number, updateData: UpdateCategoryDto) {
    const categoryInfo = { ...updateData, id: categoryId };
    const data = await this.categoryRepository.save(categoryInfo);
    return { statusCode: 200, data };
  }
  // 카테고리 비활성화
  async deactivateCategory(categoryId: number) {
    const data = await this.categoryRepository.update(categoryId, { isActive: false });
    return { statusCode: 200, data };
  }
}
