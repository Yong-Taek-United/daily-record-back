import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokens } from 'src/shared/entities/refreshToken.entity';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { TokenHelperService } from 'src/shared/services/token-helper.service';
import * as bcrypt from 'bcrypt';
import { AuthType } from 'src/shared/types/enums/users.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshTokens)
    private readonly refreshTokensRepository: Repository<RefreshTokens>,
    private readonly usersHelperService: UsersHelperService,
    private readonly tokenHelperService: TokenHelperService,
  ) {}

  // 회원 인증
  async validateUser(email: string, password: string, authType: AuthType = AuthType.BASIC): Promise<any> {
    const user = await this.usersHelperService.findUserByField('email', email);
    if (user !== null && user.authType === authType) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  // 로그인 제어
  async login(user: any) {
    const tokens = await this.generateTokens(user);
    return tokens;
  }

  // 리프레시 토큰 재발급 제어
  async refreshTokens(user: any, refreshToken: string) {
    const tokenData = await this.refreshTokensRepository.findOne({ where: { user: { id: user.id } } });
    if (!tokenData || !tokenData.refreshToken) throw new ForbiddenException('접근 권한이 없습니다.');

    const isMatch = await bcrypt.compare(refreshToken, tokenData.refreshToken);
    if (!isMatch) throw new ForbiddenException('접근 권한이 없습니다.');

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  // 로그인 토큰 발급 제어
  async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, username: user.username, nickname: user.nickname };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenHelperService.generateAccessToken(payload),
      this.tokenHelperService.generateRefreshToken(payload),
    ]);

    await this.tokenHelperService.setRefreshTokenToUserDB(user, refreshToken);

    return { accessToken, refreshToken };
  }
}
