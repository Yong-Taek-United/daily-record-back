import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../shared/entities/users.entity';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto, DeleteUserDto, ResetPasswordDto } from '../shared/dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(EmailLogs)
    private readonly emailLogsRepository: Repository<EmailLogs>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 회원가입
  async signUp(userData: CreateUserDto) {
    const { email, nickname, password, authType } = userData;
    const userInfo = {
      email,
      nickname,
      password,
      authType,
      username: await this.createUsername(),
    };

    let isExist = await this.findUserByField('email', email);
    if (isExist) throw new ConflictException('이미 존재하는 이메일입니다.');

    userInfo.password = await this.hashPassword(password);

    const data = await this.usersRepository.save(userInfo);
    delete data.password;

    return { statusCode: 201, data };
  }

  // 회원 조회
  async getUser(userId: number) {
    const user = await this.findUserByField('id', userId);
    if (!user) throw new BadRequestException('회원 정보가 존재하지 않습니다.');
    const { password, ...data } = user;
    return { statusCode: 200, data };
  }

  // 회원정보 수정
  async updateUser(userId: number, userData: UpdateUserDto) {
    if (userData.password) {
      if (userData.password !== userData.password2) throw new BadRequestException(['비밀번호를 다시 확인해주십시오.']);
      delete userData.password2;

      userData.password = await this.hashPassword(userData.password);
    }

    await this.usersRepository.update(userId, userData);

    const data = await this.findUserByField('id', userId);
    delete data.password;

    return { statusCode: 200, data };
  }

  // 회원 탈퇴
  async withdrawal(userId: number, userData: DeleteUserDto) {
    const password = (await this.findUserByField('id', userId)).password;

    const isMatch = await bcrypt.compare(userData.password, password);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    await this.usersRepository.update(userId, { isDeleted: true, deletedAt: new Date() });

    return { statusCode: 200 };
  }

  // 비밀번호 재설정 처리
  async ResetPasswordByEmail(userData: ResetPasswordDto) {
    const { emailToken, emailLogId, password } = userData;
    const emailLog = await this.emailLogsRepository.findOne({ where: { id: emailLogId } });
    if (!emailLog.isChecked) throw new UnprocessableEntityException('요청 처리가 가능한 상태가 아닙니다.');

    const secretKey = this.configService.get<string>('JWT_EMAIL_SECRET');
    const payload = this.jwtService.verify(emailToken, { secret: secretKey, ignoreExpiration: true });
    return await this.ResetPassword(payload.userId, password);
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

  // 비밀번호 재설정
  async ResetPassword(userId: number, password: string) {
    password = await this.hashPassword(password);
    const result = await this.usersRepository.update(userId, { password: password });
    if (result.affected === 0) throw new BadRequestException('비밀번호 수정에 실패했습니다.');
    return { statusCode: 200 };
  }
}
