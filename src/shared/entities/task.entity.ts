import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Project } from './project.entity';
import { Event } from './event.entity';
import { TaskGoal } from './taskGoal.entity';
import { Icon } from './icon.entity';
import { Medal } from './medal.entity';

@Entity({ schema: 'dailyrecord', name: 'Task' })
export class Task {
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

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Category, (category) => category.tasks)
  category: Category;

  @ManyToOne(() => Icon, (icon) => icon.tasks)
  icon: Icon[];

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @OneToMany(() => TaskGoal, (taskGoal) => taskGoal.task)
  taskGoals: TaskGoal;

  @OneToMany(() => Event, (event) => event.task)
  events: Event[];

  @OneToMany(() => Medal, (medal) => medal.task)
  medals: Medal[];
}
