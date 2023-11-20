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
  WELCOME_SUBJECT,
  WELCOME_TEMPLATE,
} from 'src/shared/constants/emailMessage.constant.';
import {
  EMAIL_VERIFICATION_FAILURE_URL,
  EMAIL_VERIFICATION_URL,
  PASSWORD_RESET_URL,
} from '../constants/clientURL.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailHelperService {
  constructor(
    @InjectRepository(EmailLogs)
    private emailLogsRepository: Repository<EmailLogs>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly tokenHelperService: TokenHelperService,
  ) {}

  // 이메일 발송
  async HandleSendEmail(emailData: any) {
    const { email, emailType, user } = emailData;

    const emailLog = await this.createEmailLog({
      email,
      emailType,
      ...(user && { userId: user.id }),
    });

    const context = await this.createEmailContext({ emailLog, ...(user && { user }) });
    const emailTemplate = await this.createEmailTemplate(emailType, email, context);

    await this.sendEmail(emailTemplate);
  }

  // 이메일 발송
  async sendEmail(emailTemplate: any) {
    await this.mailerService
      .sendMail(emailTemplate)
      .then(() => {})
      .catch((error) => {
        console.error(error);
        throw new InternalServerErrorException('이메일 발송에 실패했습니다.');
      });
  }

  // 이메일 로그 생성
  async createEmailLog(emailLogData: EmailLogData) {
    const { email, emailType, userId } = emailLogData;

    await this.emailLogsRepository.update({ email, emailType }, { isVerifable: false });

    const payload = { email, ...(userId && { userId }) };
    const emailToken = await this.tokenHelperService.generateToken(payload, 'EMAIL');
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
      case 'VERIFICATION':
        emailTemplate.subject = EMAIL_VERIFICATION_SUBJECT;
        emailTemplate.template = EMAIL_VERIFICATION_TEMPLATE;
        break;
      case 'PASSWORD':
        emailTemplate.subject = PASSWORD_RESET_SUBJECT;
        emailTemplate.template = PASSWORD_RESET_TEMPLATE;
        break;
      case 'WELCOME':
        emailTemplate.subject = WELCOME_SUBJECT;
        emailTemplate.template = WELCOME_TEMPLATE;
        break;
    }

    return emailTemplate;
  }

  // 이메일 템플릿 context 생성
  async createEmailContext(emailData: any) {
    const { emailLog, user } = emailData;

    const protocol = this.configService.get<string>('PROTOCOL');
    const host = this.configService.get<string>('HOST');
    const port = this.configService.get<number>('PORT');
    const hostname = `${protocol}://${host}:${port}`;

    let context: {} = {};
    switch (emailLog.emailType) {
      case 'VERIFICATION':
        context = {
          hostname,
          emailLogId: emailLog.id,
          token: emailLog.emailToken,
        };
        break;
      case 'PASSWORD':
        context = {
          hostname,
          ...(user && { nickname: user.nickname }),
          emailLogId: emailLog.id,
          token: emailLog.emailToken,
        };
        break;
      case 'WELCOME':
        context = {
          hostname,
          ...(user && { nickname: user.nickname }),
        };
        break;
    }

    return context;
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
