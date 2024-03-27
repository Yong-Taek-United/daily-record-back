import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ColorService } from './color.service';
import { CreateColorDto, UpdateColorDto } from 'src/shared/dto/color.dto';
import { Public } from 'src/shared/decorators/skip-auth.decorator';

@Controller('colors')
@ApiTags('Color')
@ApiBearerAuth()
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post('')
  @ApiOperation({ summary: '컬러 생성', description: '컬러를 생성합니다.' })
  async createColor(@Body() createData: CreateColorDto) {
    const data = await this.colorService.createColor(createData);
    return { statusCode: 201, data };
  }

  @Get('list')
  @Public()
  @ApiOperation({ summary: '컬러 목록 조회', description: '컬러 목록을 조회합니다.' })
  async getColorList() {
    const data = await this.colorService.getColorList();
    return { statusCode: 200, data };
  }

  @Patch(':colorId')
  @ApiOperation({ summary: '컬러 수정', description: '컬러를 수정합니다.' })
  @ApiParam({ name: 'colorId', example: 1 })
  async updateColor(@Param('colorId') colorId: number, @Body() updateData: UpdateColorDto) {
    const data = await this.colorService.updateColor(colorId, updateData);
    return { statusCode: 200, data };
  }

  @Patch('deactivate/:colorId')
  @ApiOperation({ summary: '컬러 비활성화', description: '컬러를 비활성화합니다.' })
  @ApiParam({ name: 'colorId', example: 1 })
  async deactivateColor(@Param('colorId') colorId: number) {
    const data = await this.colorService.deactivateColor(colorId);
    return { statusCode: 200, data };
  }
}
