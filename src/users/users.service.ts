import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateUserDto, UpdateUserDto, DeleteUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  // 회원가입
  async signUp(userData: CreateUserDto) {
    const { email, username, password, password2 } = userData;

    let isExist = await this.findUserByField('email', email);
    if (isExist) throw new ConflictException(['이미 존재하는 이메일입니다.']);

    isExist = await this.findUserByField('username', username);
    if (isExist) throw new ConflictException(['이미 존재하는 계정입니다.']);

    if (password != password2) throw new BadRequestException(['비밀번호를 다시 확인해주십시오.']);
    delete userData.password2;

    userData.password = await this.hashPassword(password);

    const data = await this.usersRepository.save(userData);
    delete data.password;

    return { statusCode: 201, data };
  }

  // 회원 조회
  async get(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('회원 정보가 존재하지 않습니다.');
    const { password, ...data } = user;
    return { statusCode: 200, data };
  }

  // 회원정보 수정
  async update(userId: number, userData: UpdateUserDto) {
    if (userData.password) {
      if (userData.password !== userData.password2) throw new BadRequestException(['비밀번호를 다시 확인해주십시오.']);
      delete userData.password2;

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    await this.usersRepository.update(userId, userData);

    const data = await this.usersRepository.findOne({ where: { id: userId } });
    delete data.password;

    return { statusCode: 200, data };
  }

  // 회원 탈퇴
  async delete(userId: number, userData: DeleteUserDto) {
    const password = (await this.usersRepository.findOne({ where: { id: userId } })).password;

    const isMatch = await bcrypt.compare(userData.password, password);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    await this.usersRepository.update(userId, { isDeleted: true, deletedAt: new Date() });

    return { statusCode: 200 };
  }

  // 회원 조회(by 특정 필드)
  async findUserByField(field: string, value: any) {
    return await this.usersRepository.findOne({ where: { [field]: value } });
  }

  // 비밀번호 해시
  async hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
