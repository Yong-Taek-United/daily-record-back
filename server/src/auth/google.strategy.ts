import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from 'passport';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private authService: AuthService) {
        super({
            clientID: process.env.OAUTH_GOOGLE_ID,
            clientSecret: process.env.OAUTH_GOOGLE_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/callback',
            scope: ['email', 'profile'],
        });
  }

  async validate (accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const { id, displayName, emails } = profile
    const googleUser = {
        email: emails[0].value,
        username: displayName,
        password: id,
        oauth: 'google'
    }
    const user = await this.authService.validateGoodleUser(googleUser);
    // 계정 정보가 없는 경우
    if (!user) {
        throw new UnauthorizedException({exist: false, userData: googleUser});
    }
    // 계정 정보가 있지만 oauth가 아닌 경우
    if(!user.isOauth) {
        throw new UnauthorizedException({exist: true, userData: googleUser});
    }
    return user;
  }
}