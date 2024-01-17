import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/shared/decorators/skip-auth.decorator';
import { AuthPasswordDto, LoginDto } from '../../shared/dto/auth.dto';
import { LocalAuthGuard } from '../../shared/guards/local-auth.guard';
import { GoogleAuthGuard } from '../../shared/guards/google-auth.guard';
import { JwtRefreshAuthGuard } from '../../shared/guards/jwt-refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '로그인', description: '회원을 인증하여 token을 발급해 클라이언트 cookie에 저장합니다.' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(req.user, res);
  }

  @Post('refresh')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh Token 재발급',
    description: 'refreshToken을 이용해 token을 재발급합니다. <br> (refreshToken으로 자물쇠를 잠그십시오.)',
  })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.refreshTokens(req.user, res);
  }

  @Post('logout')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃', description: 'cookie에 저장된 token을 제거해 로그아웃합니다.' })
  async logout(@Req() req, @Res() res: Response) {
    return await this.authService.logout(req, res);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    return await this.authService.googleLogin(req.user, res);
  }

  @Post('password')
  @ApiBearerAuth()
  @ApiOperation({ summary: '비밀번호 인증', description: '비밀번호로 사용자를 인증합니다.' })
  async authByPassword(@Req() req, @Body() authData: AuthPasswordDto) {
    return await this.authService.authByPassword(req.user, authData);
  }
}
