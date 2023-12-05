import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserProfile } from './userProfile.entity';
import { UserFile } from './userFile.entity';
import { Event } from './event.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';
import { RefreshToken } from './refreshToken.entity';
import { AuthType, UserType } from 'src/shared/types/enums/user.enum';

@Entity({ schema: 'dailyrecord', name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.BASIC })
  userType: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.BASIC })
  authType: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 30 })
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'datetime', default: null })
  passwordChangedAt: Date;

  @Column({ type: 'tinyint', default: false })
  isEmailVerified: Boolean;

  @Column({ type: 'tinyint', default: false })
  isPhoneVerified: Boolean;

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

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, { cascade: true })
  userProfile: UserProfile;

  @OneToMany(() => UserFile, (userFile) => userFile.user)
  userFiles: UserFile[];

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken;
}
