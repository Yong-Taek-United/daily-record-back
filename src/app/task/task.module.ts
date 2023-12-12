import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/shared/entities/task.entity';
import { Activity } from 'src/shared/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Activity])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
