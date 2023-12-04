import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { TokenHelperService } from 'src/shared/services/token-helper.service';
import { CookieHelperService } from 'src/shared/services/cookie-helper.service';
import * as bcrypt from 'bcrypt';
import { AuthType } from 'src/shared/types/enums/users.enum';
import { SIGN_UP_GOOGLE_URL } from 'src/shared/constants/clientURL.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersHelperService: UsersHelperService,
    private readonly tokenHelperService: TokenHelperService,
    private readonly cookieHelperService: CookieHelperService,
  ) {}

  // 회원 인증
  async validateUser(email: string, password: string, authType: AuthType = AuthType.BASIC) {
    const { password: passwordFormDB, ...user } = await this.usersHelperService.getUserWithRelations('email', email);

    if (!!user && user.authType === authType) {
      const isMatch = await bcrypt.compare(password, passwordFormDB);
      if (isMatch) return user;
    }
    return null;
  }

  // 로그인 제어
  async login(user: any, res: Response) {
    const tokens = await this.generateLoginTokens(user);

    await this.cookieHelperService.saveTokensToCookies(res, tokens);

    return { statusCode: 200, data: user };
  }

  // 구글 로그인 제어
  async googleLogin(user: any, res: Response) {
    const tokens = user.id
      ? await this.generateLoginTokens(user)
      : await this.tokenHelperService.generateToken(user, 'GOOGLE_USER');
    const redirectURL = user.id ? '/' : `${SIGN_UP_GOOGLE_URL}?userToken=${tokens}`;

    return { redirect: redirectURL };
  }

  // 리프레시 토큰 재발급 제어
  async refreshTokens(user: any, res: Response) {
    const tokens = await this.generateLoginTokens(user);

    await this.cookieHelperService.saveTokensToCookies(res, tokens);

    return { statusCode: 200, data: user };
  }

  // 로그아웃 제어
  async logout(req: any, res: Response) {
    const payload = await this.tokenHelperService.getPayloadFromToken(req);
    if (payload) await this.tokenHelperService.removeTokensFromUserDB(payload.sub);

    const cookieNames = ['accessToken', 'refreshToken'];

    await this.cookieHelperService.removeTokensFromCookies(res, cookieNames);

    return { statusCode: 200 };
  }

  // 로그인 토큰 발급 제어
  async generateLoginTokens(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username, nickname: user.nickname };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenHelperService.generateToken(payload, 'ACCESS'),
      this.tokenHelperService.generateToken(payload, 'REFRESH'),
    ]);

    await this.tokenHelperService.setRefreshTokenToUserDB(user, refreshToken);

    return { accessToken, refreshToken };
  }
}
