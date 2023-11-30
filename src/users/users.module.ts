import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from 'src/shared/entities/users.entity';
import { UserFiles } from 'src/shared/entities/userFiles.entity';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersHelperService } from 'src/shared/services/users-helper.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from 'src/shared/configs/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserFiles, EmailLogs]),
    ConfigModule,
    JwtModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfig,
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => EmailModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersHelperService],
  exports: [UsersHelperService],
})
export class UsersModule {}
