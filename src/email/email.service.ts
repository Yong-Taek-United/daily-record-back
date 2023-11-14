import { GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';
import { PASSWORD_RESET_SUBJECT, PASSWORD_RESET_TEMPLATE } from 'src/shared/constants/emailMessages';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailLogs)
    private emailLogsRepository: Repository<EmailLogs>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
  ) {}

  // 비밀번호 재설정 이메일 발송 처리
  async emailResetPassword(email: string) {
    let user = await this.usersService.findUserByField('email', email);
    if (!user) throw new NotFoundException('일치하는 회원 정보가 존재하지 않습니다.');

    const token = await this.authService.generateEmailToken({ userId: user.id, email });
    const emailLog = await this.emailLogsRepository.save({ email, emailToken: token, emailType: EmailType.PASSWORD });

    const emailData = {
      to: email,
      subject: PASSWORD_RESET_SUBJECT,
      template: PASSWORD_RESET_TEMPLATE,
      context: {
        nickname: user.nickname,
        emailLogId: emailLog.id,
        token: token,
      },
    };

    await this.sendEmail(emailData);

    return { statusCode: 200 };
  }

  // 이메일 확인 처리
  async checkEmail(id: number, emailToken: string) {
    const emailLog = await this.emailLogsRepository.findOne({ where: { id, emailToken } });
    if (!emailLog) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');
    if (emailLog.isChecked) throw new GoneException('이미 처리가 완료된 작업입니다.');

    await this.emailLogsRepository.update(emailLog.id, { isChecked: true });
    const redirectEndPoint = `/reset-password?emailLogId=${emailLog.id}&emailToken=${emailToken},`;

    return { redirect: redirectEndPoint };
  }

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
}
