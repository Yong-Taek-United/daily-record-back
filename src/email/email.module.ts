import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailConfig } from 'src/config/email.config';

@Module({
  imports: [
    UsersModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: EmailConfig,
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
