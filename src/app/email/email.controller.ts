import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/skip-auth.decorator';
import { EmailService } from './email.service';
import { VerifyEmailDto } from '../../shared/dto/email.dto';

@Controller('emails')
@ApiTags('Email')
@Public()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('email-verification')
  @ApiOperation({
    summary: '사용자 인증 이메일 발송',
    description: '이메일 중복 확인으로 인한 에러가 발생할 수 있습니다. [emailType: VERIFICATION]',
  })
  async sendEmailVerification(@Body() emailData: VerifyEmailDto) {
    await this.emailService.sendEmailVerification(emailData);
    return { statusCode: 200 };
  }

  @Post('reset-password')
  @ApiOperation({
    summary: '비밀번호 재설정 이메일 발송',
    description: '회원 email 정보 조회 에러가 발생할 수 있습니다. [emailType: PASSWORD]',
  })
  async sendEmailResetPassword(@Body() emailData: VerifyEmailDto) {
    await this.emailService.emailResetPassword(emailData);
    return { statusCode: 200 };
  }

  @Get('verify')
  @ApiOperation({
    summary: '이메일 인증 처리',
    description: '이메일에 제공된 버튼을 클릭해 사용자를 인증합니다.',
  })
  async verifyEmail(@Query('id') emailLogId: number, @Query('token') emailToken: string) {
    const data = await this.emailService.verifyEmail(emailLogId, emailToken);
    return { redirect: data };
  }

  @Post('email-verification/check')
  @ApiOperation({
    summary: '이메일 인증 여부 확인',
    description: '마우스 클릭 이벤트마다 호출해주세요. 인증 미완료 시, 에러가 발생합니다.',
  })
  async checkEmailVelified(@Body() emailData: VerifyEmailDto) {
    await this.emailService.checkEmailVelified(emailData);
    return { statusCode: 200 };
  }
}
