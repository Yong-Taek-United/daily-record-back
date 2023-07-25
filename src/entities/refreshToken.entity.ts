import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity({ schema: 'dailyrecord', name: 'RefreshTokens' })
export class RefreshTokens {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'tinyint', default: false })
  isRevoked: Boolean;

  @Column({ type: 'varchar', length: 100, default: null })
  refreshToken: string;

  @Column({ type: 'datetime', default: null })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.refreshTokens)
  user: Users;
}
