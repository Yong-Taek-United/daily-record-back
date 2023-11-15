import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokens } from '../entities/refreshToken.entity';
import { UsersHelperService } from './users-helper.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenHelperService {
  constructor(
    @InjectRepository(RefreshTokens)
    private readonly refreshTokensRepository: Repository<RefreshTokens>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersHelperService: UsersHelperService,
  ) {}

  // 토큰 발급: 액세스 토큰
  async generateAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  // 토큰 발급: 리프레시 토큰
  async generateRefreshToken(payload: any) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME');

    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  // 토큰 발급: 구글 회원 정보 토큰
  async generateGoogleUserToken(payload: any) {
    const secret = this.configService.get<string>('JWT_GOOGLE_USER_SECRET');
    const expiresIn = this.configService.get<string>('JWT_GOOGLE_USER_EXPIRATION_TIME');

    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  // 토큰 발급: 이메일 인증 토큰
  async generateEmailToken(payload: any) {
    const secret = this.configService.get<string>('JWT_EMAIL_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EMAIL_EXPIRATION_TIME');

    return await this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  // 토큰 해독: 페이로드 추출
  async getPayloadFromToken(req: any) {
    try {
      const token: string = req.headers.authorization.replace('Bearer ', '');
      const payload = this.jwtService.verify(token, { ignoreExpiration: true });
      return payload;
    } catch {
      return false;
    }
  }
  // 리프레시 토큰 DB 저장
  async setRefreshTokenToUserDB(user: any, refreshToken: string) {
    const hashedRefreshToken = await this.getHashedRefreshToken(refreshToken);
    const refreshTokenExp = await this.getRefreshTokenExp(refreshToken);

    const tokenInfo = {
      user: user,
      refreshToken: hashedRefreshToken,
      expiresAt: refreshTokenExp,
      isRevoked: false,
    };

    const tokenData = await this.refreshTokensRepository.findOne({ where: { user: { id: user.id } } });
    if (!tokenData) {
      const result = await this.refreshTokensRepository.insert(tokenInfo);
      if (result.identifiers.length === 0) throw new InternalServerErrorException();
    } else {
      const result = await this.refreshTokensRepository.update({ user: user.id }, tokenInfo);
      if (result.affected === 0) throw new InternalServerErrorException();
    }
  }

  // 리프레시 토큰 DB 삭제
  async removeTokensFromUserDB(userId: number) {
    const user = await this.usersHelperService.findUserByField('id', userId);

    const tokenInfo = {
      user: user,
      refreshToken: null,
      expiresAt: null,
      isRevoked: true,
    };
    await this.refreshTokensRepository.update(userId, tokenInfo);
  }

  // 리프레시 토큰 해시(DB 데이터)
  async getHashedRefreshToken(refreshToken: string) {
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    return hashedRefreshToken;
  }

  // 리프레시 토큰 만료일 생성(DB 데이터)
  async getRefreshTokenExp(refreshToken: string): Promise<Date> {
    const decodedToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    const expiration = decodedToken.exp;

    const refreshTokenExp = new Date(expiration * 1000);

    return refreshTokenExp;
  }
}
