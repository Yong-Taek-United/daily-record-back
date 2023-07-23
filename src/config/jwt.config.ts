import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      signOptions: {
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
      },
    };
  }
}
