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

  @Column({ type: 'varchar', length: 100, default: '' })
  title: string;

  @Column({ type: 'varchar', length: 300, default: '' })
  description: string;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.activitys)
  user: User;

  @ManyToOne(() => Category, (category) => category.activitys)
  category: Category;

  @ManyToOne(() => Project, (project) => project.activitys, {
    nullable: true,
  })
  project: Project;

  @ManyToOne(() => Task, (task) => task.activitys, {
    nullable: true,
  })
  task: Task;

  @OneToMany(() => ActivityFile, (activityFile) => activityFile.activity)
  activityFiles: ActivityFile[];
}
