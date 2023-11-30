import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../shared/entities/users.entity';
import { UserFiles } from 'src/shared/entities/userFiles.entity';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { UserProfiles } from 'src/shared/entities/userProfiles.entity';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from '../shared/dto/users.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { EmailHelperService } from 'src/shared/services/email-helper.service';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import { AuthType } from 'src/shared/types/enums/users.enum';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';
import { FileStorageType, UserFileType } from 'src/shared/types/enums/files.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(UserFiles)
    private readonly userProfilesRepository: Repository<UserFiles>,
    @InjectRepository(EmailLogs)
    private readonly emailLogsRepository: Repository<EmailLogs>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
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
      isEmailVerified: true,
      userProfile: new UserProfiles(),
    };

    const user = await this.usersHelperService.findUserByField('email', email);
    if (user) throw new ConflictException('이미 존재하는 이메일입니다.');

    userInfo.password = await this.usersHelperService.hashPassword(password);

    const data = await this.usersRepository.save(userInfo);
    delete data.password;

    await this.emailHelperService.HandleSendEmail({ email, emailType: EmailType.WELCOME, user: data });

    return { statusCode: 201, data };
  }

  // 소셜 회원가입
  async signUpSocail(userData: CreateUserDto, res: Response) {
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

    const user = await this.usersHelperService.findUserByField('email', email);
    if (user)
      throw new ConflictException(`이미 ${user.authType} 회원가입으로 등록된 이메일입니다. 로그인을 진행할까요?`);

    userInfo.password = await this.usersHelperService.hashPassword(password);

    const data = await this.usersRepository.save(userInfo);
    delete data.password;

    switch (authType) {
      case AuthType.GOOGLE:
        await this.authService.googleLogin(data, res);
        break;
    }

    await this.emailHelperService.HandleSendEmail({ email, emailType: EmailType.WELCOME, user: data });

    return { statusCode: 201, data };
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
    const { emailToken, emailLogId, newPassword } = userData;
    const emailLog = await this.emailLogsRepository.findOne({ where: { id: emailLogId } });
    if (!emailLog.isChecked) throw new UnprocessableEntityException('요청 처리가 가능한 상태가 아닙니다.');

    const secretKey = this.configService.get<string>('JWT_EMAIL_SECRET');
    const payload = this.jwtService.verify(emailToken, { secret: secretKey, ignoreExpiration: true });
    return await this.resetPassword(payload.userId, newPassword);
  }

  // 비밀번호 변경 처리
  async changePassword(userId: number, userData: ChangePasswordDto) {
    let { currentPassword, newPassword } = userData;
    const user = await this.usersHelperService.findUserByField('id', userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password)))
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return await this.resetPassword(userId, newPassword);
  }

  // 비밀번호 재설정 처리
  async resetPassword(userId: number, password: string) {
    password = await this.usersHelperService.hashPassword(password);
    const result = await this.usersRepository.update(userId, { password: password, passwordChangedAt: new Date() });
    if (result.affected === 0) throw new BadRequestException('비밀번호 변경에 실패했습니다.');
    return { statusCode: 200 };
  }

  // 회원 프로필 이미지 등록 처리
  async uploadProfileImage(userId: number, files: Express.Multer.File[]) {
    const fileRootDirectory = this.configService.get<string>('FILE_STORAGE_PATH');

    const user = await this.usersHelperService.findUserByField('id', userId);

    const fileInfo = files.map((file, index) => ({
      seqNo: index,
      fileType: UserFileType.PROFILE,
      fileStorageType: FileStorageType.DISK,
      filePath: file.destination.replace(fileRootDirectory, ''),
      fileName: file.filename,
      mimeType: file.mimetype,
      fileSize: file.size,
      user: user,
    }));

    await this.userProfilesRepository.update(
      { user: { id: userId }, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
    );
    await this.userProfilesRepository.insert(fileInfo);
    return { statusCode: 201 };
  }
}
