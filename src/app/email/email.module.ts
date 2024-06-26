import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from 'src/app/user/user.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { EmailLog } from 'src/shared/entities/emailLog.entity';
import { User } from 'src/shared/entities/user.entity';
import { EmailConfig } from 'src/shared/configs/email.config';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailHelperService } from 'src/shared/services/email-helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLog, User]),
    MailerModule.forRootAsync({
      useClass: EmailConfig,
    }),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  providers: [EmailService, EmailHelperService],
  controllers: [EmailController],
  exports: [EmailHelperService],
})
export class EmailModule {}
