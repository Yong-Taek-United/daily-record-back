import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from 'src/shared/entities/color.entity';
import { CreateColorDto, UpdateColorDto } from 'src/shared/dto/color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  // 컬러 생성
  async createColor(createData: CreateColorDto) {
    const data = await this.colorRepository.save(createData);
    return { statusCode: 201, data };
  }
  // 컬러 목록 조회
  async getColorList() {
    const data = await this.colorRepository.find({ where: { isActive: true } });
    return { statusCode: 200, data };
  }
  // 컬러 수정
  async updateColor(colorId: number, updateData: UpdateColorDto) {
    const colorInfo = { ...updateData, id: colorId };
    const data = await this.colorRepository.save(colorInfo);
    return { statusCode: 200, data };
  }
  // 컬러 비활성화
  async deactivateColor(colorId: number) {
    const data = await this.colorRepository.update(colorId, { isActive: false });
    return { statusCode: 200, data };
  }
}
