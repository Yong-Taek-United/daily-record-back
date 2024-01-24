import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../entities/refreshToken.entity';

@Injectable()
export class TokenHelperService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // 토큰 발급
  async generateToken(payload: any, tokenType: string) {
    let secret = '';
    let expiresIn = '';

    switch (tokenType) {
      case 'ACCESS':
        secret = this.configService.get<string>('JWT_ACCESS_SECRET');
        expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME');
        break;
      case 'REFRESH':
        secret = this.configService.get<string>('JWT_REFRESH_SECRET');
        expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME');
        break;
      case 'GOOGLE_USER':
        secret = this.configService.get<string>('JWT_GOOGLE_USER_SECRET');
        expiresIn = this.configService.get<string>('JWT_GOOGLE_USER_EXPIRATION_TIME');
        break;
      case 'EMAIL':
        secret = this.configService.get<string>('JWT_EMAIL_SECRET');
        expiresIn = this.configService.get<string>('JWT_EMAIL_EXPIRATION_TIME');
        break;
    }

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

  // 회원 리프레시 토큰 DB 조회
  async findRefreshTokenByUserId(userId: number) {
    return await this.refreshTokenRepository.findOne({ where: { user: { id: userId } } });
  }

  // 리프레시 토큰 DB 저장
  async setRefreshTokenToUserDB(user: any, refreshToken: string) {
    const refreshTokenExp = await this.getRefreshTokenExp(refreshToken);

    const tokenInfo = {
      user: user,
      refreshToken,
      expiresAt: refreshTokenExp,
      isRevoked: false,
    };

    const tokenData = await this.refreshTokenRepository.findOne({ where: { user: { id: user.id } } });
    if (!tokenData) {
      const result = await this.refreshTokenRepository.insert(tokenInfo);
      if (result.identifiers.length === 0) throw new InternalServerErrorException();
    } else {
      const result = await this.refreshTokenRepository.update({ user: user.id }, tokenInfo);
      if (result.affected === 0) throw new InternalServerErrorException();
    }
  }

  // 리프레시 토큰 DB 삭제
  async removeTokensFromUserDB(userId: number) {
    const tokenInfo = {
      refreshToken: null,
      expiresAt: null,
      isRevoked: true,
    };
    await this.refreshTokenRepository.update({ user: { id: userId } }, tokenInfo);
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
