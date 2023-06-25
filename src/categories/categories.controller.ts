import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // 카테고리 생성
  @Post()
  create(@Body() categoryData) {
    return this.categoriesService.create(categoryData);
  }

  // 카테고리 전체 조회
  @Get('/')
  getCategories() {
    return this.categoriesService.getCategories();
  }

  // 카테고리 개별 조회
  @Get('/:id')
  getCategory(@Param('id') categoryId: number) {
    return this.categoriesService.getCategory(categoryId);
  }

  // 카테고리 수정
  @Patch('/:id')
  update(@Param('id') categoryId: number, @Body() categoryData) {
    return this.categoriesService.update(categoryId, categoryData);
  }

  // 카테고리 삭제
  @Delete('/:id')
  delete(@Param('id') categoryId: number) {
    return this.categoriesService.delete(categoryId);
  }
}
