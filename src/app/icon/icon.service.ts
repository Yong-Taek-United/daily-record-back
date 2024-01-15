import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icon } from 'src/shared/entities/icon.entity';
import { CreateIconDto, UpdateIconDto } from 'src/shared/dto/icon.dto';
import { IconType } from 'src/shared/types/enums/file.enum';

@Injectable()
export class IconService {
  constructor(
    @InjectRepository(Icon)
    private readonly iconRepository: Repository<Icon>,
  ) {}

  // 아이콘 생성
  async createIcon(createData: CreateIconDto) {
    const data = await this.iconRepository.save(createData);
    return { statusCode: 201, data };
  }
  // 아이콘 목록 조회
  async getIconList(iconType: IconType) {
    const data = await this.iconRepository.find({ where: { iconType: iconType, isActive: true } });
    return { statusCode: 200, data };
  }
  // 아이콘 수정
  async updateIcon(iconId: number, updateData: UpdateIconDto) {
    const iconInfo = { ...updateData, id: iconId };
    const data = await this.iconRepository.save(iconInfo);
    return { statusCode: 200, data };
  }
  // 아이콘 비활성화
  async deactivateIcon(iconId: number) {
    const data = await this.iconRepository.update(iconId, { isActive: false });
    return { statusCode: 200, data };
  }
}
