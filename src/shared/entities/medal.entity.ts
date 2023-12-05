import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';
import { Icon } from './icon.entity';

@Entity({ schema: 'dailyrecord', name: 'Medal' })
export class Medal {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, default: '' })
  title: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  description: string;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Icon, (icon) => icon.medals)
  icon: Icon[];

  @ManyToOne(() => Task, (task) => task.medals)
  task: Task[];
}
