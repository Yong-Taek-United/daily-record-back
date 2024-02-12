import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { CycleType } from 'src/shared/types/enums/task.enum';

@Entity({ schema: 'dailyrecord', name: 'TaskPush' })
export class TaskPush {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: CycleType, default: CycleType.DAY })
  cycleType: string;

  @Column({ type: 'time', default: '00:00:00' })
  pushTime: string;

  @Column({ type: 'tinyint', default: true })
  isPushEnabled: boolean;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Task, (task) => task.taskPush)
  @JoinColumn()
  task: Task;
}
