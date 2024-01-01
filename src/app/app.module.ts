import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ActivityModule } from './activity/activity.module';
import { EmailModule } from './email/email.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from '../shared/interceptors/api-response.interceptor';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { TypeOrmConfig } from '../shared/configs/typeorm.config';
import { ErrorExceptionFilter } from 'src/shared/filters/errorException.Filter';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFilePath = `.env.${nodeEnv}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProjectModule,
    TaskModule,
    ActivityModule,
    EmailModule,
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
