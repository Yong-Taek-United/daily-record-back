import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { IconType } from 'src/shared/types/enums/file.enum';
import { Medal } from './medal.entity';

@Entity({ schema: 'dailyrecord', name: 'Icon' })
export class Icon {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: IconType })
  iconType: string;

  @Column({ type: 'varchar', length: 20 })
  iconName: string;

  @Column({ type: 'tinyint', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.icon)
  task: Task[];

  @OneToMany(() => Medal, (medal) => medal.icon)
  medal: Medal[];
}
