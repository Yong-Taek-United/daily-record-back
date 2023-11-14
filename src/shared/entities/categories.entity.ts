import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tasks } from './tasks.entity';
import { Events } from './events.entity';

@Entity({ schema: 'dailyrecord', name: 'Categories' })
export class Categories {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  colorCode: string;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tasks, (tasks) => tasks.category)
  tasks: Tasks[];

  @OneToMany(() => Events, (events) => events.category)
  events: Events[];
}
