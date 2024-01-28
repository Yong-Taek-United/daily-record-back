import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ColorModule } from './color/color.module';
import { IconModule } from './icon/icon.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ActivityModule } from './activity/activity.module';
import { EmailModule } from './email/email.module';
import { ErrorExceptionFilter } from 'src/shared/filters/errorException.Filter';
import { ApiResponseInterceptor } from '../shared/interceptors/api-response.interceptor';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { TypeOrmConfig } from '../shared/configs/typeorm.config';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFilePath = `.env.${nodeEnv}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProjectModule,
    TaskModule,
    ActivityModule,
    EmailModule,
    ColorModule,
    IconModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    ...(nodeEnv === 'development'
      ? [
          {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
          },
        ]
      : []),
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
