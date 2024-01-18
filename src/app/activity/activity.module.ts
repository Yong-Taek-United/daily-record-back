import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from 'src/shared/entities/activity.entity';
import { Task } from 'src/shared/entities/task.entity';
import { TaskGoal } from 'src/shared/entities/taskGoal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Task, TaskGoal])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
