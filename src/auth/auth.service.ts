import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(email);
    if (user !== null) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('접근 권한이 없습니다.');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('접근 권한이 없습니다.');

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username, nickname: user.nickname };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: any) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME');

    const refreshToken = await this.jwtService.signAsync({ id: payload.sub }, { secret, expiresIn });

    return refreshToken;
  }

  async saveTokensToCookies(res: Response, tokens: any) {
    const option = { httpOnly: true };

    Object.entries(tokens).forEach(([key, value]) => {
      res.cookie(key, value, option);
    });
  }

  async removeTokensFromCookies(res: Response) {
    const cookieNames = ['accessToken', 'refreshToken'];

    cookieNames.forEach((cookieName) => {
      res.clearCookie(cookieName);
    });
  }
}
