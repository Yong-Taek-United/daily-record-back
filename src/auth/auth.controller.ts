import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './jwt/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth.dto';
import { Response } from 'express';
import { Public } from 'src/decorator/skip-auth.decorator';

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
    const tokens = await this.authService.login(req.user);

    await this.authService.saveTokensToCookies(res, tokens);

    return {
      statusCode: 200,
      data: tokens,
    };
  }

  // @Get()
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary: 'Access Token 인증',
  //   description: 'accessToken을 이용해 로그인 회원을 인증합니다. <br> (accessToken으로 자물쇠를 잠그십시오.)',
  // })
  // @UseGuards(JwtAuthGuard)
  // userAuth(@Req() req) {
  //   return {
  //     statusCode: 200,
  //     data: req.user,
  //   };
  // }

  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh Token 재발급',
    description: 'refreshToken을 이용해 token을 재발급합니다. <br> (refreshToken으로 자물쇠를 잠그십시오.)',
  })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const tokens = await this.authService.refreshTokens(userId, refreshToken);

    await this.authService.saveTokensToCookies(res, tokens);

    return {
      statusCode: 200,
      data: tokens,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: 'cookie에 저장된 token을 제거해 로그아웃합니다.' })
  async logout(@Res() res: Response) {
    await this.authService.removeTokensFromCookies(res);

    return {
      statusCode: 200,
    };
  }
}
