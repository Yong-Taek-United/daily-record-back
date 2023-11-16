import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersHelperService {
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
  async createUsername(): Promise<string> {
    let username = 'user-';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    for (let i = 0; i < length; i++) {
      username += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const user = await this.findUserByField('username', username);
    if (user) return this.createUsername();

    return username;
  }

  // 비밀번호 해시
  async hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
