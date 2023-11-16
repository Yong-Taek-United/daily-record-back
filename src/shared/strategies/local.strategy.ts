import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    this.userIsNotVerified(user);
    return user;
  }

  private userIsNotVerified(user: any): void {
    if (!user) throw new UnauthorizedException('로그인 정보를 다시 확인해주세요.');

    if (!user.isEmailVerified)
      throw new UnauthorizedException('회원가입 이메일 인증이 아직 완료되지 않았습니다. 이메일을 확인해주세요.');
  }
}
