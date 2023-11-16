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
import { UserProfiles } from 'src/shared/entities/userProfiles.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto, DeleteUserDto, ResetPasswordDto } from '../shared/dto/users.dto';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { EmailHelperService } from 'src/shared/services/email-helper.service';
import * as bcrypt from 'bcrypt';
import { AuthType } from 'src/shared/types/enums/users.enum';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(EmailLogs)
    private readonly emailLogsRepository: Repository<EmailLogs>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersHelperService: UsersHelperService,
    private readonly emailHelperService: EmailHelperService,
  ) {}

  // 회원가입
  async signUp(userData: CreateUserDto) {
    const { email, nickname, password, authType } = userData;
    const userInfo = {
      email,
      nickname,
      password,
      authType,
      username: await this.usersHelperService.createUsername(),
      isEmailVerified: false,
      userProfile: new UserProfiles(),
    };

    let isExist = await this.usersHelperService.findUserByField('email', email);
    if (isExist) throw new ConflictException('이미 존재하는 이메일입니다.');

    userInfo.password = await this.usersHelperService.hashPassword(password);

    const data = await this.usersRepository.save(userInfo);
    delete data.password;

    await this.emailSignup(data);

    return { statusCode: 201, data };
  }

  // 소셜 회원가입
  async signUpSocail(userData: CreateUserDto) {
    const { email, nickname, password, authType } = userData;
    const userInfo = {
      email,
      nickname,
      password,
      authType,
      username: await this.usersHelperService.createUsername(),
      isEmailVerified: true,
      userProfile: new UserProfiles(),
    };

    let isExist = await this.usersHelperService.findUserByField('email', email);
    if (isExist)
      throw new ConflictException(`이미 ${isExist.authType} 회원가입으로 등록된 이메일입니다. 로그인을 진행할까요?`);

    userInfo.password = await this.usersHelperService.hashPassword(password);

    const data = await this.usersRepository.save(userInfo);
    delete data.password;

    return { statusCode: 201, data };
  }

  // 회원가입 이메일 인증 발송 처리
  async emailSignup(user: any) {
    const emailLog = await this.emailHelperService.createEmailLog(user, EmailType.SIGN);
    const context = {
      nickname: user.nickname,
      emailLogId: emailLog.id,
      token: emailLog.emailToken,
    };

    const emailTemplate = await this.emailHelperService.createEmailTemplate('SIGN_UP', user.email, context);
    await this.emailHelperService.sendEmail(emailTemplate);
  }

  // 회원 조회
  async getUser(userId: number) {
    const user = await this.usersHelperService.findUserByField('id', userId);
    if (!user) throw new BadRequestException('회원 정보가 존재하지 않습니다.');
    const { password, ...data } = user;
    return { statusCode: 200, data };
  }

  // 회원정보 수정
  async updateUser(userId: number, userData: UpdateUserDto) {
    if (userData.password) {
      if (userData.password !== userData.password2) throw new BadRequestException(['비밀번호를 다시 확인해주십시오.']);
      delete userData.password2;

      userData.password = await this.usersHelperService.hashPassword(userData.password);
    }

    await this.usersRepository.update(userId, userData);

    const data = await this.usersHelperService.findUserByField('id', userId);
    delete data.password;

    return { statusCode: 200, data };
  }

  // 회원 탈퇴
  async withdrawal(userId: number, userData: DeleteUserDto) {
    const password = (await this.usersHelperService.findUserByField('id', userId)).password;

    const isMatch = await bcrypt.compare(userData.password, password);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    await this.usersRepository.update(userId, { isDeleted: true, deletedAt: new Date() });

    return { statusCode: 200 };
  }

  // 비밀번호 재설정 처리
  async resetPasswordByEmail(userData: ResetPasswordDto) {
    const { emailToken, emailLogId, password } = userData;
    const emailLog = await this.emailLogsRepository.findOne({ where: { id: emailLogId } });
    if (!emailLog.isChecked) throw new UnprocessableEntityException('요청 처리가 가능한 상태가 아닙니다.');

    const secretKey = this.configService.get<string>('JWT_EMAIL_SECRET');
    const payload = this.jwtService.verify(emailToken, { secret: secretKey, ignoreExpiration: true });
    return await this.resetPassword(payload.userId, password);
  }

  // 비밀번호 재설정
  async resetPassword(userId: number, password: string) {
    password = await this.usersHelperService.hashPassword(password);
    const result = await this.usersRepository.update(userId, { password: password });
    if (result.affected === 0) throw new BadRequestException('비밀번호 수정에 실패했습니다.');
    return { statusCode: 200 };
  }
}
