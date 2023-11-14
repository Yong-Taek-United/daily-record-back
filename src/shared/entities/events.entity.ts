import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Dailies } from './dailies.entity';
import { Users } from './users.entity';
import { Categories } from './categories.entity';
import { Projects } from './projects.entity';
import { Tasks } from './tasks.entity';
import { EventFiles } from './eventFiles.entity';

@Entity({ schema: 'dailyrecord', name: 'Events' })
export class Events {
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

  @ManyToOne(() => Users, (user) => user.events)
  user: Users;

  @ManyToOne(() => Categories, (category) => category.events)
  category: Categories;

  @ManyToOne(() => Dailies, (daily) => daily.events)
  daily: Dailies;

  @ManyToOne(() => Projects, (project) => project.events, {
    nullable: true,
  })
  project: Projects;

  @ManyToOne(() => Tasks, (task) => task.events, {
    nullable: true,
  })
  task: Tasks;

  @OneToMany(() => EventFiles, (eventFiles) => eventFiles.event)
  eventFiles: EventFiles[];
}
