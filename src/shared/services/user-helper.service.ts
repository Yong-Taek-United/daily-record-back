import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';
import { GenerateUtility } from '../utilities/generate.utility';

@Injectable()
export class UserHelperService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  // 회원 조회(by 특정 필드)
  async findUserByField(field: string, value: any, optionColumns: {} = {}) {
    const defaultColumns = { [field]: value, isDeleted: false, isActive: true, isAdmin: false };
    const columns = { ...defaultColumns, ...optionColumns };
    return await this.usersRepository.findOne({ where: columns });
  }

  // username 생성
  async createUsername(attempts = 10): Promise<string> {
    if (attempts === 0) throw InternalServerErrorException;
    const username = GenerateUtility.generateRandomString('user-', 10);
    const user = await this.findUserByField('username', username);
    return !!user ? await this.createUsername(attempts - 1) : username;
  }

  // 비밀번호 해시
  async hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  // 회원 연관 정보 조회
  async getUserWithRelations(field: string, value: any) {
    const setParams = {
      value: value,
      isDeleted: false,
    };

    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.userProfile', 'userProfile')
      .leftJoinAndSelect('users.userFiles', 'userFiles', 'userFiles.isDeleted = :isDeleted')
      .where(`users.${field} = :value`)
      .andWhere('users.isDeleted = :isDeleted')
      .setParameters(setParams)
      .getOne();

    if (!user) throw new NotFoundException('회원 정보가 존재하지 않습니다.');

    return user;
  }
}
