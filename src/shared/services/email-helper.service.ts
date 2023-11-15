import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PASSWORD_RESET_SUBJECT, PASSWORD_RESET_TEMPLATE } from 'src/shared/constants/emailMessages';

@Injectable()
export class EmailHelperService {
  constructor(private readonly mailerService: MailerService) {}

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
