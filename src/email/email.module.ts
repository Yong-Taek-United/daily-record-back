import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailConfig } from 'src/config/email.config';
import { EmailLogs } from 'src/entities/emailLog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogs]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: EmailConfig,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
