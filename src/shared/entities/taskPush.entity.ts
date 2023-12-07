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

  @Column({ type: 'enum', enum: CycleType })
  cycleType: string;

  @Column({ type: 'int', default: 0 })
  pushTime: number;

  @Column({ type: 'tinyint', default: true })
  isPushEnabled: Boolean;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Task, (task) => task.taskPush)
  @JoinColumn()
  task: Task;
}
