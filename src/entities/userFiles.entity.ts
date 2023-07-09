import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

enum FileType {
  PROFILE = 'profile',
  FEED = 'feed',
}

@Entity({ schema: 'dailyrecord', name: 'UserFiles' })
export class UserFiles {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: FileType, default: FileType.PROFILE })
  fileType: string;

  @Column({ type: 'varchar', length: 100 })
  filePath: string;

  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => Users, (users) => users.userFiles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: Users;
}
