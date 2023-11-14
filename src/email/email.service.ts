import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { EmailLogs } from 'src/entities/emailLog.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
    if (!user) throw new BadRequestException('일치하는 회원 정보가 존재하지 않습니다.');

    // 토큰 생성
    const token = await this.authService.generateEmailToken({ id: user.id, email });

    // DB 이메일 로그 생성
    const emailLog = await this.emailLogsRepository.save({ email, emailToken: token });

    const emailData = {
      to: email,
      subject: '비밀번호 재설정 안내',
      text: '아래 버튼을 클릭해 비밀번호를 재설정해 주세요.',
      html: `<p>아래 버튼을 클릭해 비밀번호를 재설정해 주세요.</p>
              <a href="http://localhost:5000/emails/check?userId=${emailLog.id}&token=${token}">비밀번호 재설정</a>`,
    };

    // 이메일 전송
    await this.sendEmail(emailData);

    return { statusCode: 200, data: { email: email } };
  }

  // 이메일 발송
  async sendEmail(emailData: any) {
    await this.mailerService
      .sendMail(emailData)
      .then(() => {})
      .catch((error) => {
        throw new BadRequestException();
      });
  }
}
