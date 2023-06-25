import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Tasks } from './tasks.entity';

@Entity({ schema: 'daily-record', name: 'GOAL' })
export class Goals {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: ['DAY', 'WEEK', 'MONTH', 'YEAR'] })
  cycle: string;

  @Column({ type: 'enum', enum: ['COUNT', 'DURATION'] })
  countType: string;

  @Column({ type: 'int', default: 0 })
  target: number;

  @Column({ type: 'int', default: 0 })
  accumulation: number;

  @Column({ type: 'date' })
  startedAt: Date;

  @Column({ type: 'date' })
  finishedAt: Date;

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

  @OneToOne(() => Tasks, (tasks) => tasks.goals)
  task: Tasks;
}
