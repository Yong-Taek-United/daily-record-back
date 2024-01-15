import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { IconService } from './icon.service';
import { CreateIconDto, UpdateIconDto } from 'src/shared/dto/icon.dto';
import { IconType } from 'src/shared/types/enums/file.enum';

@Controller('icons')
@ApiTags('Icon')
@ApiBearerAuth()
export class IconController {
  constructor(private readonly iconService: IconService) {}

  @Post('')
  @ApiOperation({
    summary: '아이콘 생성',
    description: '아이콘을 생성합니다. 아이콘 파일은 클라이언트에서 준비합니다.',
  })
  async createIcon(@Body() createData: CreateIconDto) {
    return this.iconService.createIcon(createData);
  }

  @Get('list/:iconType')
  @ApiOperation({ summary: '아이콘 목록 조회', description: '과제 혹은 메달 아이콘 목록을 조회합니다.' })
  @ApiParam({ name: 'iconType', example: IconType.TASK })
  async getIconList(@Param('iconType') iconType: IconType) {
    return this.iconService.getIconList(iconType);
  }

  @Patch(':iconId')
  @ApiOperation({ summary: '아이콘 수정', description: '아이콘을 수정합니다.' })
  @ApiParam({ name: 'iconId', example: 1 })
  async updateIcon(@Param('iconId') iconId: number, @Body() updateData: UpdateIconDto) {
    return this.iconService.updateIcon(iconId, updateData);
  }

  @Patch('deactivate/:iconId')
  @ApiOperation({ summary: '아이콘 비활성화', description: '아이콘을 비활성화합니다.' })
  @ApiParam({ name: 'iconId', example: 1 })
  async deactivateIcon(@Param('iconId') iconId: number) {
    return this.iconService.deactivateIcon(iconId);
  }
}
