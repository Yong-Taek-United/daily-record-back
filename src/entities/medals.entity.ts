import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Tasks } from './tasks.entity';
import { Icons } from './icons.entity';

@Entity({ schema: 'dailyrecord', name: 'Medals' })
export class Medals {
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

  @ManyToOne(() => Icons, (icon) => icon.medals)
  icon: Icons[];

  @ManyToOne(() => Tasks, (task) => task.medals)
  task: Tasks[];
}
