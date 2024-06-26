import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from 'src/shared/entities/project.entity';
import { Task } from 'src/shared/entities/task.entity';
import { Activity } from 'src/shared/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, Activity])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
