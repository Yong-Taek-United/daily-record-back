import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailLogs } from '../entities/emailLog.entity';
import { TokenHelperService } from './token-helper.service';
import { Users } from '../entities/users.entity';
import {
  EMAIL_VERIFICATION_SUBJECT,
  EMAIL_VERIFICATION_TEMPLATE,
  PASSWORD_RESET_SUBJECT,
  PASSWORD_RESET_TEMPLATE,
} from 'src/shared/constants/emailMessage.constant.';
import {
  EMAIL_VERIFICATION_FAILURE_URL,
  EMAIL_VERIFICATION_URL,
  PASSWORD_RESET_URL,
} from '../constants/clientURL.constant';

@Injectable()
export class EmailHelperService {
  constructor(
    @InjectRepository(EmailLogs)
    private emailLogsRepository: Repository<EmailLogs>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly mailerService: MailerService,
    private readonly tokenHelperService: TokenHelperService,
  ) {}

  // 이메일 발송
  async sendEmail(emailData: any) {
    await this.mailerService
      .sendMail(emailData)
      .then(() => {})
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException('이메일 발송에 실패했습니다.');
      });
  }

  // 이메일 로그 생성
  async createEmailLog(emailLogData: EmailLogData) {
    const { email, emailType, userId } = emailLogData;

    await this.emailLogsRepository.update({ email, emailType }, { isVerifiable: false });

    const payload = { email, ...(userId && { userId }) };
    const emailToken = await this.tokenHelperService.generateToken(payload, 'EMAIL_VERIFICATION');
    const emailLog = await this.emailLogsRepository.save({
      email,
      emailToken,
      emailType,
    });
    return emailLog;
  }

  // 이메일 템플릿 생성
  async createEmailTemplate(emailType: string, email: string, context?: {}) {
    let emailTemplate: EmailTemplate = {
      to: email,
      subject: '',
      template: '',
      context: context,
    };

    switch (emailType) {
      case 'EMAIL_VERIFICATION':
        emailTemplate.subject = EMAIL_VERIFICATION_SUBJECT;
        emailTemplate.template = EMAIL_VERIFICATION_TEMPLATE;
        break;
      case 'PASSWORD_RESET':
        emailTemplate.subject = PASSWORD_RESET_SUBJECT;
        emailTemplate.template = PASSWORD_RESET_TEMPLATE;
        break;
    }

    return emailTemplate;
  }

  // 이메일 리디렉션 URL 생성
  async createRedirectionURL(isSuccess, emailLog: any, emailToken: string) {
    let redirectURL: string = '';
    if (isSuccess)
      switch (emailLog.emailType) {
        case 'VERIFICATION':
          await this.usersRepository.update({ email: emailLog.email }, { isEmailVerified: true });
          redirectURL = `${EMAIL_VERIFICATION_URL}`;
          break;
        case 'PASSWORD':
          redirectURL = `${PASSWORD_RESET_URL}?emailLogId=${emailLog.id}&emailToken=${emailToken}`;
          break;
      }
    else redirectURL = `${EMAIL_VERIFICATION_FAILURE_URL}`;

    return redirectURL;
  }
}
