import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Events } from './events.entity';
import { MimeType } from 'src/shared/types/enums/files.enum';

@Entity({ schema: 'dailyrecord', name: 'EventFiles' })
export class EventFiles {
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
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @ManyToOne(() => Events, (event) => event.eventFiles)
  event: Events;
}
