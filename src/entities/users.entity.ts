import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserFiles } from './userFiles.entity';
import { Dailies } from './dailies.entity';
import { Events } from './events.entity';
import { Projects } from './projects.entity';
import { Tasks } from './tasks.entity';

enum UserType {
  BASIC = 'basic',
  ADMIN = 'admin',
}

enum AuthType {
  BASIC = 'basic',
  GOOGLE = 'google',
  KAKAO = 'kakao',
}

@Entity({ schema: 'dailyrecord', name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.BASIC })
  userType: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.BASIC })
  authType: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 15 })
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'tinyint', default: true })
  isActive: Boolean;

  @Column({ type: 'tinyint', default: false })
  isAdmin: Boolean;

  @Column({ type: 'tinyint', default: false })
  isDeleted: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', default: null })
  deletedAt: Date;

  @Column({ type: 'varchar', length: 100, default: null })
  refreshToken: string;

  @Column({ type: 'datetime', default: null })
  refreshTokenExp: Date;

  @OneToMany(() => UserFiles, (userFiles) => userFiles.user)
  userFiles: UserFiles[];

  @OneToMany(() => Dailies, (dailies) => dailies.user)
  dailies: Dailies[];

  @OneToMany(() => Projects, (projects) => projects.user)
  projects: Projects[];

  @OneToMany(() => Tasks, (tasks) => tasks.user)
  tasks: Tasks[];

  @OneToMany(() => Events, (events) => events.user)
  events: Events[];
}
