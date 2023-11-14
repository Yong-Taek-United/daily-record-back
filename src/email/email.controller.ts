import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/skip-auth.decorator';
import { EmailService } from './email.service';
import { EmailDto } from '../shared/dto/email.dto';

@Controller('emails')
@ApiTags('Emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('/check')
  @Public()
  @ApiOperation({
    summary: '이메일 확인',
    description: '이메일에 제공된 버튼을 클릭해 사용자를 인증합니다.',
  })
  async checkEmail(@Query('id') id: number, @Query('token') emailToken: string) {
    return this.emailService.checkEmail(id, emailToken);
  }

  @Post('/reset-password')
  @Public()
  @ApiOperation({
    summary: '비밀번호 재설정 이메일 발송',
    description: '회원 email 정보 조회 에러가 발생할 수 있습니다.',
  })
  async emailResetPassword(@Body() emailData: EmailDto) {
    return await this.emailService.emailResetPassword(emailData.email);
  }
}
