import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DailiesModule } from './dailies/dailies.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { Users } from './entities/users.entity';
import { UserFiles } from './entities/userFiles.entity';
import { Dailies } from './entities/dailies.entity';
import { Events } from './entities/events.entity';
import { Categories } from './entities/categories.entity';
import { Projects } from './entities/projects.entity';
import { Tasks } from './entities/tasks.entity';
import { Goals } from './entities/goals.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './interceptor/api-response.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Users, UserFiles, Dailies, Events, Categories, Projects, Tasks, Goals],
      synchronize: true,
      // timezone: 'z',
      charset: 'utf8mb4',
    }),
    UsersModule,
    AuthModule,
    DailiesModule,
    EventsModule,
    ProjectsModule,
    TasksModule,
    CategoriesModule,
    ProjectsModule,
    TasksModule,
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
