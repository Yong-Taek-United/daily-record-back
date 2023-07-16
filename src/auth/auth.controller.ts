import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '회원을 인증하여 token을 발급해 클라이언트 cookie에 저장합니다.' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
    });

    return {
      statusCode: 200,
      data: tokens,
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그인 인증', description: 'accessToken을 이용해 로그인 상태를 인증합니다.' })
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Login "accessToken" (자물쇠를 accessToken으로 먼저 잠그고 실행해야합니다.)',
    schema: {
      type: 'string',
    },
  })
  userAuth(@Req() req) {
    return req.user;
  }
}
