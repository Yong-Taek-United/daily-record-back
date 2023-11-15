import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailLogs } from '../entities/emailLog.entity';
import { TokenHelperService } from './token-helper.service';
import { EmailType } from '../types/enums/emailLog.enum';
import { PASSWORD_RESET_SUBJECT, PASSWORD_RESET_TEMPLATE } from 'src/shared/constants/emailMessages';

@Injectable()
export class EmailHelperService {
  constructor(
    @InjectRepository(EmailLogs)
    private emailLogsRepository: Repository<EmailLogs>,
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
  async createEmailLog(user: any) {
    const token = await this.tokenHelperService.generateEmailToken({ userId: user.id, email: user.email });
    const emailLog = await this.emailLogsRepository.save({
      email: user.email,
      emailToken: token,
      emailType: EmailType.PASSWORD,
    });
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
      case 'PASSWORD_RESET':
        emailTemplate.subject = PASSWORD_RESET_SUBJECT;
        emailTemplate.template = PASSWORD_RESET_TEMPLATE;
        break;
    }

    return emailTemplate;
  }
}
