import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';
import { EmailHelperService } from 'src/shared/services/email-helper.service';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { TokenHelperService } from 'src/shared/services/token-helper.service';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailLogs)
    private emailLogsRepository: Repository<EmailLogs>,
    private readonly emailHelperService: EmailHelperService,
    private readonly tokenHelperService: TokenHelperService,
    private readonly usersHelperService: UsersHelperService,
  ) {}

  // 비밀번호 재설정 이메일 발송 처리
  async emailResetPassword(email: string) {
    const user = await this.usersHelperService.findUserByField('email', email);
    if (!user) throw new NotFoundException('일치하는 회원 정보가 존재하지 않습니다.');

    const token = await this.tokenHelperService.generateEmailToken({ userId: user.id, email });
    const emailLog = await this.emailLogsRepository.save({ email, emailToken: token, emailType: EmailType.PASSWORD });

    const context = {
      nickname: user.nickname,
      emailLogId: emailLog.id,
      token: emailLog.emailToken,
    };
    const emailTemplate = await this.emailHelperService.createEmailTemplate('PASSWORD_RESET', email, context);

    await this.emailHelperService.sendEmail(emailTemplate);

    return { statusCode: 200 };
  }

  // 이메일 확인 처리
  async checkEmail(id: number, emailToken: string) {
    const emailLog = await this.emailLogsRepository.findOne({ where: { id, emailToken } });
    if (!emailLog) throw new NotFoundException('요청하신 데이터를 찾을 수 없습니다.');

    await this.emailLogsRepository.update(emailLog.id, { isChecked: true });
    const redirectEndPoint = `/reset-password?emailLogId=${emailLog.id}&emailToken=${emailToken},`;

    return { redirect: redirectEndPoint };
  }
}
