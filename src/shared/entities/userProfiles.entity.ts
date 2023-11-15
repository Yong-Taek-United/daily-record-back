import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity({ schema: 'dailyrecord', name: 'UserProfiles' })
export class UserProfiles {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 20, default: null })
  phone: string;

  @Column({ type: 'varchar', length: 100, default: null })
  introduce: string;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => Users, (user) => user.userProfiles)
  user: Users;
}
