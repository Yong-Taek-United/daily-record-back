import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UserHelperService } from 'src/shared/services/user-helper.service';
import { TokenHelperService } from 'src/shared/services/token-helper.service';
import { CookieHelperService } from 'src/shared/services/cookie-helper.service';
import { User } from 'src/shared/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthType } from 'src/shared/types/enums/user.enum';
import { SIGN_UP_GOOGLE_URL } from 'src/shared/constants/clientURL.constant';
import { AuthPasswordDto } from 'src/shared/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userHelperService: UserHelperService,
    private readonly tokenHelperService: TokenHelperService,
    private readonly cookieHelperService: CookieHelperService,
  ) {}

  // 회원 인증
  async validateUser(email: string, password: string, authType: AuthType = AuthType.BASIC) {
    const user = await this.userHelperService.getUserWithRelations('email', email);

    if (!!user) {
      if (user.authType === authType) {
        const passwordFormDB = await this.userHelperService.getUserPassword(user.id);
        const isMatch = await bcrypt.compare(password, passwordFormDB);
        if (isMatch) return user;
      }
      throw new UnauthorizedException(`로그인 방식이 다른 회원 유형(${authType})입니다.`);
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

  // 비밀번호 인증
  async authByPassword(user: User, authData: AuthPasswordDto) {
    const passwordFormDB = await this.userHelperService.getUserPassword(user.id);
    const isMatch = await bcrypt.compare(authData.password, passwordFormDB);
    if (!isMatch) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return { statusCode: 200 };
  }
}
