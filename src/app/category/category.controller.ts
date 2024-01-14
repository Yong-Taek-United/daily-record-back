import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/shared/dto/category.dto';

@Controller('categories')
@ApiTags('Category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @ApiOperation({ summary: '카테고리 생성', description: '카테고리를 생성합니다.' })
  async createCategory(@Body() createData: CreateCategoryDto) {
    return this.categoryService.createCategory(createData);
  }

  @Get('list')
  @ApiOperation({ summary: '카테고리 목록을 조회', description: '카테고리를 목록을 조회합니다.' })
  async getCategoryList() {
    return this.categoryService.getCategoryList();
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: '카테고리 수정', description: '카테고리를 수정합니다.' })
  @ApiParam({ name: 'categoryId', example: 1 })
  async updateCategory(@Param('categoryId') categoryId: number, @Body() updateData: UpdateCategoryDto) {
    return this.categoryService.updateCategory(categoryId, updateData);
  }

  @Patch('deactivate/:categoryId')
  @ApiOperation({ summary: '카테고리 비활성화', description: '카테고리를 비활성화합니다.' })
  @ApiParam({ name: 'categoryId', example: 1 })
  async deactivateCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.deactivateCategory(categoryId);
  }
}
