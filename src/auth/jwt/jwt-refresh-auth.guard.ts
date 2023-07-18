import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      switch (info.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('인증 토큰이 만료되었습니다.');
          break;
        case 'JsonWebTokenError':
          throw new UnauthorizedException('인증 토큰이 유효하지 않습니다.');
          break;
        default:
          throw new UnauthorizedException(info.message);
          break;
      }
    }
    return user;
  }
}
