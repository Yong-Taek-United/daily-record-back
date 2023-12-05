import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { EmailModule } from './email/email.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './shared/interceptors/api-response.interceptor';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { TypeOrmConfig } from './shared/configs/typeorm.config';
import { ActivityModule } from './activity/activity.module';

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
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    CategoriesModule,
    ProjectsModule,
    TasksModule,
    EmailModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
