import { Injectable, UnauthorizedException, ExecutionContext, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/skip-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

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

  // 전역 Guard 예외 설정 - @Public
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    else return super.canActivate(context);
  }
}
