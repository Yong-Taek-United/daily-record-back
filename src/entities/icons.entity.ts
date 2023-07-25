import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tasks } from './tasks.entity';
import { IconType, MimeType } from 'src/types/enums/files.enum';
import { Medals } from './medals.entity';

@Entity({ schema: 'dailyrecord', name: 'Icons' })
export class Icons {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: IconType })
  iconType: string;

  @Column({ type: 'varchar', length: 20 })
  iconName: string;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tasks, (tasks) => tasks.icon)
  tasks: Tasks[];

  @OneToMany(() => Medals, (medals) => medals.icon)
  medals: Medals[];
}
