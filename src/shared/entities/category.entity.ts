import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { Activity } from './activity.entity';

@Entity({ schema: 'dailyrecord', name: 'Category' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.category)
  task: Task[];

  @OneToMany(() => Activity, (activity) => activity.category)
  activity: Activity[];
}
