import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';
import { Activity } from './activity.entity';

@Entity({ schema: 'dailyrecord', name: 'Project' })
export class Project {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, default: '' })
  title: string;

  @Column({ type: 'varchar', length: 300, default: '' })
  description: string;

  @Column({ type: 'date' })
  startedAt: Date;

  @Column({ type: 'date' })
  finishedAt: Date;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @Column({ type: 'tinyint', default: false })
  isComplated: Boolean;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Activity, (activity) => activity.project)
  activitys: Activity[];
}
