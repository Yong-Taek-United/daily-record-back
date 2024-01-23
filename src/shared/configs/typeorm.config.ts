import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<number>('DB_PORT')),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [`${__dirname}/${this.configService.get<string>('DB_ENTITIES')}`],
      synchronize: Boolean(this.configService.get<boolean>('DB_SYNCHRONIZE')),
      charset: this.configService.get<string>('DB_CHARSET'),
      timezone: this.configService.get<string>('DB_TIMEZONE'),
    };
  }
}
