import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailConfig } from 'src/shared/configs/email.config';
import { EmailLogs } from 'src/shared/entities/emailLog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailHelperService } from 'src/shared/services/email-helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogs]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: EmailConfig,
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [EmailService, EmailHelperService],
  controllers: [EmailController],
})
export class EmailModule {}
