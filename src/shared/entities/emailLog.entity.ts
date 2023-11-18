import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';

@Entity({ schema: 'dailyrecord', name: 'EmailLogs' })
export class EmailLogs {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: EmailType })
  emailType: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  emailToken: string;

  @Column({ type: 'tinyint', default: false })
  isChecked: Boolean;

  @Column({ type: 'tinyint', default: true })
  isVerifiable: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  checkedAt: Date;
}
