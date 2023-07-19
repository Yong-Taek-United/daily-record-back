import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokens } from 'src/entities/refreshToken.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokens)
    private readonly refreshTokensRepository: Repository<RefreshTokens>,
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
    const tokenData = await this.refreshTokensRepository.findOne({ where: { user: { id: userId } } });
    if (!tokenData || !tokenData.refreshToken) throw new ForbiddenException('접근 권한이 없습니다.');

    const isMatch = await bcrypt.compare(refreshToken, tokenData.refreshToken);
    if (!isMatch) throw new ForbiddenException('접근 권한이 없습니다.');

    const user = await this.usersService.findUserById(userId);
    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username, nickname: user.nickname };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    await this.setRefreshTokenToUserDB(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: any) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME');

    const refreshToken = await this.jwtService.signAsync(payload, { secret, expiresIn });

    return refreshToken;
  }

  // 리프레시 토큰 저장
  async setRefreshTokenToUserDB(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);
    const refreshTokenExp = await this.getRefreshTokenExp(refreshToken);

    const user = await this.usersService.findUserById(userId);
    const tokenInfo = {
      user: user,
      refreshToken: hashedRefreshToken,
      expiresAt: refreshTokenExp,
      isRevoked: false,
    };

    const tokenData = await this.refreshTokensRepository.findOne({ where: { user: { id: userId } } });
    if (!tokenData) {
      await this.refreshTokensRepository.save(tokenInfo);
    } else {
      await this.refreshTokensRepository.update(userId, tokenInfo);
    }
  }

  // 리프레시 토큰 해시
  async getHashedRefreshToken(refreshToken: string) {
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    return hashedRefreshToken;
  }

  // 리프레시 토큰 만료일 생성
  async getRefreshTokenExp(refreshToken: string): Promise<Date> {
    const decodedToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    const expiration = decodedToken.exp;

    const refreshTokenExp = new Date(expiration * 1000);

    return refreshTokenExp;
  }

  async removeTokensFromUserDB(userId: number) {
    const user = await this.usersService.findUserById(userId);

    const tokenInfo = {
      user: user,
      refreshToken: null,
      expiresAt: null,
      isRevoked: true,
    };
    await this.refreshTokensRepository.update(userId, tokenInfo);
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
