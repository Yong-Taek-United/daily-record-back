import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieHelperService {
  constructor(private readonly configService: ConfigService) {}

  // 토큰 Cookie 저장
  async saveTokensToCookies(res: Response, tokens: any) {
    const option: CookieOptions = {
      httpOnly: JSON.parse(this.configService.get<string>('COOKIE_OPTION_HTTP_ONLY')),
      sameSite: this.configService.get<CookieOptions['sameSite']>('COOKIE_OPTION_SAME_SITE'),
      secure: JSON.parse(this.configService.get<string>('COOKIE_OPTION_SECURE')),
      domain: this.configService.get<string>('COOKIE_OPTION_DOMAIN'),
    };

    Object.entries(tokens).forEach(([key, value]) => {
      res.cookie(key, value, option);
    });
  }

  // 토큰 Cookie 삭제
  async removeTokensFromCookies(res: Response, cookieNames: string[]) {
    cookieNames.forEach((cookieName) => {
      res.clearCookie(cookieName);
    });
  }
}
