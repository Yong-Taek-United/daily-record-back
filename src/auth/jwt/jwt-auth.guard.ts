import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/skip-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

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

  // 전역 Guard 예외 설정 - @Public
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
