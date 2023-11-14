import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class EmailConfig implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
        secure: this.configService.get<boolean>('MAIL_SECURE'),
        auth: {
          user: this.configService.get<string>('MAIL_USER_EMAIL'),
          pass: this.configService.get<string>('MAIL_USER_PASSWORD'),
        },
      },
      defaults: {
        from: `"<${this.configService.get<string>('MAIL_USER_NAME')}>" <${this.configService.get<string>(
          'MAIL_USER_EMAIL',
        )}>`,
      },
      template: {
        dir: `${__dirname}/../templates/email`,
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
