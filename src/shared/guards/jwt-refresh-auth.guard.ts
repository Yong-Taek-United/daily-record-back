import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      let errorMessage: string;
      if (info === undefined) {
        throw new NotFoundException('회원 정보가 존재하지 않습니다.');
      } else {
        switch (info.name) {
          case 'TokenExpiredError':
            errorMessage = '인증 토큰이 만료되었습니다.';
            break;
          case 'JsonWebTokenError':
            errorMessage = '인증 토큰이 유효하지 않습니다.';
            break;
          default:
            errorMessage = info.message;
            break;
        }
        throw new UnauthorizedException(errorMessage);
      }
    }
    return user;
  }
}
