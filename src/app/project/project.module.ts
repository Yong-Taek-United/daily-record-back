import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from 'src/shared/entities/project.entity';
import { User } from 'src/shared/entities/user.entity';
import { Category } from 'src/shared/entities/category.entity';
import { Icon } from 'src/shared/entities/icon.entity';
import { Task } from 'src/shared/entities/task.entity';
import { TaskGoal } from 'src/shared/entities/taskGoal.entity';
import { TaskPush } from 'src/shared/entities/taskPush.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Icon, Project, Task, TaskGoal, TaskPush])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
