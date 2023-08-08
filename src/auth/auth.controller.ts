import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/skip-auth.decorator';
import { LoginDto } from './auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '회원을 인증하여 token을 발급해 클라이언트 cookie에 저장합니다.' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const tokens = await this.authService.login(req.user);

    await this.authService.saveTokensToCookies(res, tokens);

    return {
      statusCode: 200,
      data: user,
    };
  }

  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh Token 재발급',
    description: 'refreshToken을 이용해 token을 재발급합니다. <br> (refreshToken으로 자물쇠를 잠그십시오.)',
  })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user.user;
    const refreshToken = req.user.refreshToken;
    const tokens = await this.authService.refreshTokens(user, refreshToken);

    await this.authService.saveTokensToCookies(res, tokens);

    return {
      statusCode: 200,
      data: user,
    };
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃', description: 'cookie에 저장된 token을 제거해 로그아웃합니다.' })
  async logout(@Req() req, @Res() res: Response) {
    const payload = await this.authService.getPayloadFromToken(req);
    if (payload) await this.authService.removeTokensFromUserDB(payload.sub);

    await this.authService.removeTokensFromCookies(res);

    return {
      statusCode: 200,
    };
  }
}
