import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Activity } from './activity.entity';
import { MimeType } from 'src/shared/types/enums/file.enum';

@Entity({ schema: 'dailyrecord', name: 'ActivityFile' })
export class ActivityFile {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int' })
  seqNo: number;

  @Column({ type: 'varchar', length: 100 })
  filePath: string;

  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Column({ type: 'enum', enum: MimeType })
  mimeType: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => Activity, (activity) => activity.activityFile)
  activity: Activity;
}
