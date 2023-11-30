import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';
import { FileStorageType, MimeType, UserFileType } from 'src/shared/types/enums/files.enum';

@Entity({ schema: 'dailyrecord', name: 'UserFiles' })
export class UserFiles {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int' })
  seqNo: number;

  @Column({ type: 'enum', enum: UserFileType, default: UserFileType.PROFILE })
  fileType: string;

  @Column({ type: 'enum', enum: FileStorageType, default: FileStorageType.DISK })
  fileStorageType: string;

  @Column({ type: 'varchar', length: 100 })
  filePath: string;

  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Column({ type: 'enum', enum: MimeType })
  mimeType: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => Users, (user) => user.userFiles)
  user: Users;
}
