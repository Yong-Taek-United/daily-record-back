import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthType } from 'src/shared/types/enums/users.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const { id, emails, displayName } = profile;
    const userData = {
      authType: AuthType.GOOGLE,
      email: emails[0].value,
      nickname: displayName,
      password: id,
    };

    let user = await this.authService.validateUser(userData.email, userData.password, userData.authType);

    const tokens = user
      ? await this.authService.login(user)
      : { signUpUserToken: await this.authService.generateGoogleUserToken(userData) };
    const redirectEndPoint = user ? '/' : '/sign-up/social/google';

    return { tokens, redirectEndPoint };
  }
}
