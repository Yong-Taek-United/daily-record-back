import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return await this.authService.login(req.user);
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
