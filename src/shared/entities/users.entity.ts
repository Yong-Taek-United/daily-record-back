import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserProfiles } from './userProfiles.entity';
import { UserFiles } from './userFiles.entity';
import { Dailies } from './dailies.entity';
import { Events } from './events.entity';
import { Projects } from './projects.entity';
import { Tasks } from './tasks.entity';
import { RefreshTokens } from './refreshToken.entity';
import { AuthType, UserType } from 'src/shared/types/enums/users.enum';

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

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 30 })
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

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

  @OneToOne(() => UserProfiles, (userProfile) => userProfile.user, { cascade: true })
  @JoinColumn()
  userProfile: UserProfiles;

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

  @OneToMany(() => RefreshTokens, (refreshTokens) => refreshTokens.user)
  refreshTokens: RefreshTokens;
}
