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
import { EventFile } from './eventFile.entity';

@Entity({ schema: 'dailyrecord', name: 'Event' })
export class Event {
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

  @ManyToOne(() => User, (user) => user.events)
  user: User;

  @ManyToOne(() => Category, (category) => category.events)
  category: Category;

  @ManyToOne(() => Project, (project) => project.events, {
    nullable: true,
  })
  project: Project;

  @ManyToOne(() => Task, (task) => task.events, {
    nullable: true,
  })
  task: Task;

  @OneToMany(() => EventFile, (eventFile) => eventFile.event)
  eventFiles: EventFile[];
}
