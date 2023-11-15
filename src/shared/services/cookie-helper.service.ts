import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieHelperService {
  constructor() {}

  // 토큰 Cookie 저장
  async saveTokensToCookies(res: Response, tokens: any) {
    const option: CookieOptions = {
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
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
