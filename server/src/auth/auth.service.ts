import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
    ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(email);
    if(user !== null) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateGoodleUser(userData: any): Promise<any> {
    const user = await this.usersService.getUser(userData.email);
    if(user !== null) {
      let isOauth = false;
      if (user.oauth === 'google') {
        isOauth = true;
      }
      const { password, ...result } = user;
      return {isOauth: isOauth, userData: result};
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email, username:user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}