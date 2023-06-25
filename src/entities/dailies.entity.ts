import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Events } from './events.entity';
import { Users } from './users.entity';

@Entity({ schema: 'daily-record', name: 'DAILY' })
export class Dailies {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  day: number;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (users) => users.dailies, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: Users;

  @OneToMany(() => Events, (events) => events.daily)
  events: Events[];
}
