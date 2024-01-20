import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Color } from './color.entity';
import { Project } from './project.entity';
import { Activity } from './activity.entity';
import { TaskGoal } from './taskGoal.entity';
import { TaskPush } from './taskPush.entity';
import { Icon } from './icon.entity';
import { Medal } from './medal.entity';

@Entity({ schema: 'dailyrecord', name: 'Task' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, default: null })
  title: string;

  @Column({ type: 'varchar', length: 300, default: null })
  description: string;

  @Column({ type: 'date' })
  startedAt: Date;

  @Column({ type: 'date' })
  finishedAt: Date;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @Column({ type: 'tinyint', default: false })
  isCompleted: boolean;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.task)
  user: User;

  @ManyToOne(() => Category, (category) => category.task)
  category: Category;

  @ManyToOne(() => Color, (color) => color.task)
  color: Color;

  @ManyToOne(() => Icon, (icon) => icon.task)
  icon: Icon;

  @ManyToOne(() => Project, (project) => project.task)
  project: Project;

  @OneToOne(() => TaskGoal, (taskGoal) => taskGoal.task, { cascade: true })
  taskGoal: TaskGoal;

  @OneToOne(() => TaskPush, (taskPush) => taskPush.task, { cascade: true })
  taskPush: TaskPush;

  @OneToMany(() => Activity, (activity) => activity.task)
  activity: Activity[];

  @OneToMany(() => Medal, (medal) => medal.task)
  medal: Medal[];
}
