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

  //
  async createCategory(createData: CreateCategoryDto) {
    const data = await this.categoryRepository.save(createData);
    return { statusCode: 201, data };
  }
  //
  async getCategoryList() {
    const data = await this.categoryRepository.find({ where: { isActive: true } });
    return { statusCode: 200, data };
  }
  //
  async updateCategory(categoryId: number, updateData: UpdateCategoryDto) {
    const categoryInfo = { ...updateData, id: categoryId };
    const data = await this.categoryRepository.save(categoryInfo);
    return { statusCode: 200, data };
  }
  //
  async deactivateCategory(categoryId: number) {
    const data = await this.categoryRepository.update(categoryId, { isActive: false });
    return { statusCode: 200, data };
  }
}
