import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from 'src/shared/entities/task.entity';
import { Project } from 'src/shared/entities/project.entity';
import { Activity } from 'src/shared/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, Activity])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
