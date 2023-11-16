import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailLogs } from '../entities/emailLog.entity';
import { TokenHelperService } from './token-helper.service';
import { EmailType } from '../types/enums/emailLog.enum';
import {
  SIGN_UP_SUBJECT,
  SIGN_UP_TEMPLATE,
  PASSWORD_RESET_SUBJECT,
  PASSWORD_RESET_TEMPLATE,
} from 'src/shared/constants/emailMessages';
import { Users } from '../entities/users.entity';
import { PASSWORD_RESET_URL, WELCOME_URL } from '../constants/clientURL';

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
  async createEmailLog(user: any, emailType: EmailType) {
    const token = await this.tokenHelperService.generateToken({ userId: user.id, email: user.email }, 'EMAIL_VERIFICATION');
    const emailLog = await this.emailLogsRepository.save({
      email: user.email,
      emailToken: token,
      emailType: emailType,
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
      case 'SIGN_UP':
        emailTemplate.subject = SIGN_UP_SUBJECT;
        emailTemplate.template = SIGN_UP_TEMPLATE;
        break;
      case 'PASSWORD_RESET':
        emailTemplate.subject = PASSWORD_RESET_SUBJECT;
        emailTemplate.template = PASSWORD_RESET_TEMPLATE;
        break;
    }

    return emailTemplate;
  }

  // 이메일 리디렉션 URL 생성
  async createRedirectionURL(emailLog: any, emailToken: string) {
    let redirectURL: string = '';

    switch (emailLog.emailType) {
      case 'SIGN':
        await this.usersRepository.update({ email: emailLog.email }, { isEmailVerified: true });
        redirectURL = WELCOME_URL;
        break;
      case 'PASSWORD':
        redirectURL = `${PASSWORD_RESET_URL}?emailLogId=${emailLog.id}&emailToken=${emailToken}`;
        break;
    }

    return redirectURL;
  }
}
