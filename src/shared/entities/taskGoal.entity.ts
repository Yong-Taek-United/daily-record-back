import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
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
  cycleCount: string;

  @Column({ type: 'int', default: 0 })
  target: number;

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

  @ManyToOne(() => Task, (task) => task.taskGoals)
  task: Task;
}
