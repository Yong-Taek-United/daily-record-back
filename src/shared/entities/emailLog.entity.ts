import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { EmailType } from 'src/shared/types/enums/emailLog.enum';

@Entity({ schema: 'dailyrecord', name: 'EmailLog' })
export class EmailLog {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: EmailType })
  emailType: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  emailToken: string;

  @Column({ type: 'tinyint', default: false })
  isChecked: boolean;

  @Column({ type: 'tinyint', default: true })
  isVerifable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  checkedAt: Date;
}
