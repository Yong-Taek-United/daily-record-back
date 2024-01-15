import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../shared/entities/user.entity';
import { UserFile } from 'src/shared/entities/userFile.entity';
import { EmailLog } from 'src/shared/entities/emailLog.entity';
import { UserProfile } from 'src/shared/entities/userProfile.entity';
import { ConfigService } from '@nestjs/config';
import {
  CreateUserDto,
  DeleteUserDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateUserBasicDto,
  UpdateUserProfileDto,
} from '../../shared/dto/user.dto';
import { AuthService } from 'src/app/auth/auth.service';
import { UserHelperService } from 'src/shared/services/user-helper.service';
import { EmailHelperService } from 'src/shared/services/email-helper.service';
import * as bcrypt from 'bcrypt';
import { AuthType } from 'src/shared/types/enums/user.enum';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';
import { FileStorageType, UserFileType } from 'src/shared/types/enums/file.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(EmailLog)
    private readonly emailLogRepository: Repository<EmailLog>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userHelperService: UserHelperService,
    private readonly emailHelperService: EmailHelperService,
  ) {}

  // 회원가입: 일반
  async signUp(userData: CreateUserDto) {
    const { email, nickname, password, authType } = userData;
    const userInfo = {
      email,
      nickname,
      password,
      authType,
      username: await this.userHelperService.createUsername(),
      isEmailVerified: true,
      userProfile: new UserProfile(),
    };

    const user = await this.userHelperService.findUserByField('email', email);
    if (user) throw new ConflictException('이미 존재하는 이메일입니다.');

    userInfo.password = await this.userHelperService.hashPassword(password);

    const { password: remove, ...data } = await this.userRepository.save(userInfo);

    await this.emailHelperService.HandleSendEmail({ email, emailType: EmailType.WELCOME, user: data });

    return { statusCode: 201, data };
  }

  // 회원가입: 소셜
  async signUpSocail(userData: CreateUserDto, res: Response) {
    const { email, nickname, password, authType } = userData;
    const userInfo = {
      email,
      nickname,
      password,
      authType,
      username: await this.userHelperService.createUsername(),
      isEmailVerified: true,
      userProfile: new UserProfile(),
    };

    const user = await this.userHelperService.findUserByField('email', email);
    if (user)
      throw new ConflictException(`이미 ${user.authType} 회원가입으로 등록된 이메일입니다. 로그인을 진행할까요?`);

    userInfo.password = await this.userHelperService.hashPassword(password);

    const { password: remove, ...data } = await this.userRepository.save(userInfo);

    switch (authType) {
      case AuthType.GOOGLE:
        await this.authService.googleLogin(data, res);
        break;
    }

    await this.emailHelperService.HandleSendEmail({ email, emailType: EmailType.WELCOME, user: data });

    return { statusCode: 201, data };
  }

  // 비밀번호 재설정 처리
  async resetPasswordByEmail(userData: ResetPasswordDto) {
    const { emailToken, emailLogId, newPassword } = userData;
    const emailLog = await this.emailLogRepository.findOne({ where: { id: emailLogId } });
    if (!emailLog.isChecked) throw new UnprocessableEntityException('요청 처리가 가능한 상태가 아닙니다.');

    const secretKey = this.configService.get<string>('JWT_EMAIL_SECRET');
    const payload = this.jwtService.verify(emailToken, { secret: secretKey, ignoreExpiration: true });
    await this.resetPassword(payload.userId, newPassword);
    return { statusCode: 200 };
  }

  // 비밀번호 재설정/변경
  async resetPassword(userId: number, password: string) {
    password = await this.userHelperService.hashPassword(password);
    const result = await this.userRepository.update(userId, { password: password, passwordChangedAt: new Date() });
    if (result.affected === 0) throw new BadRequestException('비밀번호 변경에 실패했습니다.');
  }

  // 회원 정보 조회 처리
  async getUserInfo(user: User) {
    const data = await this.userHelperService.getUserWithRelations('id', user.id);
    return { statusCode: 200, data };
  }

  // 회원 프로필 이미지 등록 처리
  async uploadProfileImage(user: User, files: Express.Multer.File[]) {
    const fileRootDirectory = this.configService.get<string>('FILE_STORAGE_PATH');

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

    await this.userFileRepository.update(
      { user: { id: user.id }, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
    );
    await this.userFileRepository.insert(fileInfo);
    return { statusCode: 201 };
  }

  // 비밀번호 변경 처리
  async changePassword(user: User, userData: ChangePasswordDto) {
    const passwordFormDB = await this.userHelperService.getUserPassword(user.id);
    let { currentPassword, newPassword } = userData;

    const isMatch = await bcrypt.compare(currentPassword, passwordFormDB);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    await this.resetPassword(user.id, newPassword);
    return { statusCode: 200 };
  }

  // 회원 기본 정보 수정
  async updateUserBasicInfo(user: User, userData: UpdateUserBasicDto) {
    const { id: userId, username } = user;

    if (username !== userData.username) {
      const otherUser = await this.userHelperService.findUserByField('username', userData.username);
      if (otherUser) throw new ConflictException(`이미 존재하는 계정입니다.`);
    }

    await this.userRepository.update(userId, userData);
    const { password: remove, ...data } = await this.userHelperService.findUserByField('id', userId);

    return { statusCode: 200, data };
  }

  // 회원 프로필 정보 수정
  async updateUserProfileInfo(user: User, userData: UpdateUserProfileDto) {
    await this.userProfileRepository.update({ user: { id: user.id } }, userData);
    const data = await this.userProfileRepository.findOne({ where: { user: { id: user.id } } });

    return { statusCode: 200, data };
  }

  // 회원 계정 비활성화
  async deactivateUser(user: User, userData: DeleteUserDto) {
    const passwordFormDB = await this.userHelperService.getUserPassword(user.id);
    const isMatch = await bcrypt.compare(userData.password, passwordFormDB);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const result = await this.userRepository.update(user.id, { isActive: false });
    if (result.affected === 0) throw new InternalServerErrorException();

    return { statusCode: 200 };
  }

  // 회원 계정 탈퇴
  async withdrawal(user: User, userData: DeleteUserDto) {
    const passwordFormDB = await this.userHelperService.getUserPassword(user.id);
    const isMatch = await bcrypt.compare(userData.password, passwordFormDB);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const result = await this.userRepository.update(user.id, { isDeleted: true, deletedAt: new Date() });
    if (result.affected === 0) throw new InternalServerErrorException();

    return { statusCode: 200 };
  }
}
