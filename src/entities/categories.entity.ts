import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tasks } from './tasks.entity';
import { Events } from './events.entity';

@Entity({ schema: 'dailyrecord', name: 'Categories' })
export class Categories {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  color: string;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @OneToMany(() => Tasks, (tasks) => tasks.category)
  tasks: Tasks[];

  @OneToMany(() => Events, (events) => events.category)
  events: Events[];
}
