import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Tasks } from './tasks.entity';
import { CountType, Cycle } from 'src/shared/types/enums/tasks.enum';

@Entity({ schema: 'dailyrecord', name: 'TaskGoals' })
export class TaskGoals {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: Cycle })
  cycle: string;

  @Column({ type: 'enum', enum: CountType })
  countType: string;

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

  @ManyToOne(() => Tasks, (task) => task.taskGoals)
  task: Tasks;
}
