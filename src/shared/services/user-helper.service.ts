import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { GenerateUtility } from '../utilities/generate.utility';

@Injectable()
export class UserHelperService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 회원 조회(by 특정 필드)
  async findUserByField(field: string, value: any, optionColumns: { [key: string]: any } = {}) {
    const columns = { [field]: value, ...optionColumns };
    const user = await this.userRepository.findOne({ where: columns });
    return user;
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

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')
      .leftJoinAndSelect('user.userFile', 'userFile', 'userFile.isDeleted = :isDeleted')
      .where(`user.${field} = :value`)
      .andWhere('user.isDeleted = :isDeleted')
      .setParameters(setParams)
      .getOne();

    return user;
  }

  // 회원 비밀번호 조회
  async getUserPassword(userId: number) {
    const { password } = await this.userRepository.findOne({ where: { id: userId }, select: ['password'] });
    if (!password) throw new NotFoundException('회원 정보가 존재하지 않습니다.');
    return password;
  }
}
