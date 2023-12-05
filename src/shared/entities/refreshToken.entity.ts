import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ schema: 'dailyrecord', name: 'RefreshToken' })
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'tinyint', default: false })
  isRevoked: Boolean;

  @Column({ type: 'varchar', length: 300, default: null })
  refreshToken: string;

  @Column({ type: 'datetime', default: null })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
