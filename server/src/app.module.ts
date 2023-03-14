import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DailiesModule } from './dailies/dailies.module';
import { EventsModule } from './events/events.module';
import { Users } from './entities/users.entity';
import { Dailies } from './entities/dailies.entity';
import { Events } from './entities/events.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
          Users, Dailies, Events
      ],
      "synchronize": true,
      // timezone: 'z',
      charset: 'utf8mb4',
    }),
    UsersModule,
    AuthModule,
    DailiesModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
