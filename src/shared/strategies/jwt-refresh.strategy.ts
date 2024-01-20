import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserHelperService } from '../services/user-helper.service';
import { TokenHelperService } from '../services/token-helper.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userHelperService: UserHelperService,
    private readonly tokenHelperService: TokenHelperService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userHelperService.findUserByField('id', payload.sub, { isDeleted: false });
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

    const tokenData = await this.tokenHelperService.findRefreshTokenByUserId(user.id);

    if (!tokenData || !tokenData.refreshToken) throw new ForbiddenException('접근 권한이 없습니다.');

    const isMatch = await bcrypt.compare(refreshToken, tokenData.refreshToken);
    if (!isMatch) throw new ForbiddenException('접근 권한이 없습니다.');

    return user;
  }
}
