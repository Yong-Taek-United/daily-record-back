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
import { CountType, CycleType } from 'src/shared/types/enums/task.enum';

@Entity({ schema: 'dailyrecord', name: 'TaskGoal' })
export class TaskGoal {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: CycleType })
  cycleType: string;

  @Column({ type: 'enum', enum: CountType })
  countType: string;

  @Column({ type: 'int' })
  cycleCount: number;

  @Column({ type: 'int', default: 0 })
  goal: number;

  @Column({ type: 'int', default: 0 })
  accumulation: number;

  @Column({ type: 'tinyint', default: false })
  isWeekendsExcl: Boolean;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @Column({ type: 'tinyint', default: false })
  isComplated: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Task, (task) => task.taskGoal)
  @JoinColumn()
  task: Task;
}
