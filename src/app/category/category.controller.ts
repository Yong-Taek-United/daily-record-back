import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/shared/dto/category.dto';
import { Public } from 'src/shared/decorators/skip-auth.decorator';

@Controller('categories')
@ApiTags('Category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  @ApiOperation({ summary: '카테고리 생성', description: '카테고리를 생성합니다.' })
  async createCategory(@Body() createData: CreateCategoryDto) {
    const data = await this.categoryService.createCategory(createData);
    return { statusCode: 201, data };
  }

  @Get('list')
  @Public()
  @ApiOperation({ summary: '카테고리 목록 조회', description: '카테고리 목록을 조회합니다.' })
  async getCategoryList() {
    const data = await this.categoryService.getCategoryList();
    return { statusCode: 200, data };
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: '카테고리 수정', description: '카테고리를 수정합니다.' })
  @ApiParam({ name: 'categoryId', example: 1 })
  async updateCategory(@Param('categoryId') categoryId: number, @Body() updateData: UpdateCategoryDto) {
    const data = await this.categoryService.updateCategory(categoryId, updateData);
    return { statusCode: 200, data };
  }

  @Patch('deactivate/:categoryId')
  @ApiOperation({ summary: '카테고리 비활성화', description: '카테고리를 비활성화합니다.' })
  @ApiParam({ name: 'categoryId', example: 1 })
  async deactivateCategory(@Param('categoryId') categoryId: number) {
    const data = await this.categoryService.deactivateCategory(categoryId);
    return { statusCode: 200, data };
  }
}
