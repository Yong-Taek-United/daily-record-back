import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '../shared/configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from '../shared/strategies/local.strategy';
import { JwtStrategy } from '../shared/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../shared/strategies/jwt-refresh.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokens } from 'src/shared/entities/refreshToken.entity';
import { GoogleStrategy } from '../shared/strategies/google.strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
    }),
    TypeOrmModule.forFeature([RefreshTokens]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
