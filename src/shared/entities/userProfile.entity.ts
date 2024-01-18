import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'dailyrecord', name: 'UserProfile' })
export class UserProfile {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, default: null })
  phone: string;

  @Column({ type: 'varchar', length: 100, default: null })
  introduce: string;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @OneToOne(() => User, (user) => user.userProfile)
  @JoinColumn()
  user: User;
}
