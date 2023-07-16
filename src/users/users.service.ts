import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, UpdateUserDto, DeleteUserDto } from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async create(userData: CreateUserDto) {
    const { email, password, password2 } = userData;

    const isExist = await this.usersRepository.findOne({ where: { email } });

    if (isExist) throw new ConflictException(['이미 존재하는 이메일입니다.']);

    if (password !== password2) throw new BadRequestException(['비밀번호를 다시 확인해주십시오.']);

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    const data = await this.usersRepository.save(userData);
    delete data.password;
    delete data.password2;

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

  // 회원 조회(로그인 인증용)
  async getUser(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  // 리프레시 토큰 저장
  async setRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);
    const refreshTokenExp = await this.getRefreshTokenExp(refreshToken);
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
      refreshTokenExp: refreshTokenExp,
    });
  }

  // 리프레시 토큰 해시
  async getHashedRefreshToken(refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    return hashedRefreshToken;
  }

  // 리프레시 토큰 만료일 생성
  async getRefreshTokenExp(refreshToken: string): Promise<Date> {
    const decodedToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    const expiration = decodedToken.exp;

    const refreshTokenExp = new Date(expiration * 1000);
    
    return refreshTokenExp;
  }
}
