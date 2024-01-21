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
import { Task } from './task.entity';
import { ActivityFile } from './activityFile.entity';

@Entity({ schema: 'dailyrecord', name: 'Activity' })
export class Activity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, default: null })
  title: string;

  @Column({ type: 'varchar', length: 300, default: null })
  description: string;

  @Column({ type: 'date' })
  actedDate: Date;

  @Column({ type: 'int', default: 0 })
  actedHour: number;

  @Column({ type: 'int', default: 0 })
  actedMinute: number;

  @Column({ type: 'int', default: 0 })
  filledGoal: number;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.activity)
  user: User;

  @ManyToOne(() => Category, (category) => category.activity)
  category: Category;

  @ManyToOne(() => Project, (project) => project.activity, {
    nullable: true,
  })
  project: Project;

  @ManyToOne(() => Task, (task) => task.activity, {
    nullable: true,
  })
  task: Task;

  @OneToMany(() => ActivityFile, (activityFile) => activityFile.activity)
  activityFile: ActivityFile[];
}
