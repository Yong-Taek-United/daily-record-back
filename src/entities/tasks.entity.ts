import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Users } from './users.entity';
import { Categories } from './categories.entity';
import { Projects } from './projects.entity';
import { Events } from './events.entity';
import { TaskGoals } from './taskGoals.entity';
import { Icons } from './icons.entity';
import { Medals } from './medals.entity';

@Entity({ schema: 'dailyrecord', name: 'Tasks' })
export class Tasks {
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

  @ManyToOne(() => Users, (user) => user.tasks)
  user: Users;

  @ManyToOne(() => Categories, (category) => category.tasks)
  category: Categories;

  @ManyToOne(() => Icons, (icon) => icon.tasks)
  icon: Icons[];

  @ManyToOne(() => Projects, (project) => project.tasks)
  project: Projects;

  @OneToMany(() => TaskGoals, (taskGoals) => taskGoals.task)
  taskGoals: TaskGoals;

  @OneToMany(() => Events, (events) => events.task)
  events: Events[];

  @OneToMany(() => Medals, (medals) => medals.task)
  medals: Medals[];
}
