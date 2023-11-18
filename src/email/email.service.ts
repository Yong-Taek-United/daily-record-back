import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { EmailHelperService } from 'src/shared/services/email-helper.service';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { VerifyEmailDto } from 'src/shared/dto/email.dto';
import { EMAIL_VERIFICATION_EXPIRY } from 'src/shared/constants/dateTime.constant';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailLogs)
    private emailLogsRepository: Repository<EmailLogs>,
    private readonly emailHelperService: EmailHelperService,
    private readonly usersHelperService: UsersHelperService,
  ) {}

  // 사용자 인증 이메일 발송
  async sendEmailVerification(emailData: VerifyEmailDto) {
    const { email, emailType } = emailData;
    const user = await this.usersHelperService.findUserByField('email', email);
    if (user) throw new ConflictException('이미 존재하는 이메일입니다.');

    const emailLog = await this.emailHelperService.createEmailLog({
      email,
      emailType,
    });

    const context = {
      emailLogId: emailLog.id,
      token: emailLog.emailToken,
    };
    const emailTemplate = await this.emailHelperService.createEmailTemplate('EMAIL_VERIFICATION', email, context);

    await this.emailHelperService.sendEmail(emailTemplate);

    return { statusCode: 200 };
  }

  // 비밀번호 재설정 이메일 발송 처리
  async emailResetPassword(emailData: VerifyEmailDto) {
    const { email, emailType } = emailData;
    const user = await this.usersHelperService.findUserByField('email', email);
    if (!user) throw new NotFoundException('일치하는 회원 정보가 존재하지 않습니다.');

    const emailLog = await this.emailHelperService.createEmailLog({
      email,
      emailType,
      userId: user.id,
    });

    const context = {
      nickname: user.nickname,
      emailLogId: emailLog.id,
      token: emailLog.emailToken,
    };
    const emailTemplate = await this.emailHelperService.createEmailTemplate('PASSWORD_RESET', email, context);

    await this.emailHelperService.sendEmail(emailTemplate);

    return { statusCode: 200 };
  }

  // 이메일 인증 처리
  async verifyEmail(id: number, emailToken: string) {
    const date = new Date();

    const emailLog = await this.emailLogsRepository.findOne({ where: { id, emailToken, isVerifiable: true } });
    const isSuccess =
      !!emailLog && new Date(emailLog.createdAt.getTime() + EMAIL_VERIFICATION_EXPIRY * 60 * 1000) > new Date();

    if (isSuccess) await this.emailLogsRepository.update(emailLog.id, { isChecked: true, checkedAt: date });

    const redirectURL = await this.emailHelperService.createRedirectionURL(isSuccess, emailLog, emailToken);

    return { redirect: redirectURL };
  }

  // 이메일 인증 여부 확인 처리
  async checkEmailVelified(emailData: VerifyEmailDto) {
    const { email, emailType } = emailData;

    const emailLog = await this.emailLogsRepository.findOne({ where: { email, emailType, isVerifiable: true } });
    if (!emailLog) throw new NotFoundException('이메일 인증 내역이 없습니다.');

    return { statusCode: 200 };
  }
}
