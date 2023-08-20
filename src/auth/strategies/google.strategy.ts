import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const { provider, emails, displayName, photos } = profile;
    const userData = {
      auth_type: provider.toUpperCase(),
      email: emails[0].value,
      nickname: displayName,
      image: photos[0].value,
    };

    let user = await this.authService.validateGoogleUser(userData.email);

    const tokens = user ? await this.authService.login(user) : await this.authService.generateGoogleUserToken(userData);
    const redirectEndPoint = user ? '/' : '/sign-up';

    return { tokens, redirectEndPoint };
  }
}
