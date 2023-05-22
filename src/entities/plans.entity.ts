import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Users } from "./users.entity";
import { Works } from "./works.entity";
import { Events } from "./events.entity";


@Entity({ schema: 'dairy-record', name: 'plans' })
export class Plans{
    
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', length: 300, default: null })
    description: string | null;

    @Column({ type: 'date' })
    startedAt: Date;
  
    @Column({ type: 'date' })
    finishedAt: Date;

    @Column({ type: 'tinyint', default: true })
    isActive: Boolean;

    @Column({ type: 'tinyint', default: false })
    isComplated: Boolean;

    @Column({ type: 'tinyint', default: false })
    isDeleted: Boolean;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Users, users => users.plans, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    users: Users;
    
    @OneToMany(() => Works, works => works.plans)
    works: Works[];

    @OneToMany(() => Events, events => events.plans)
    events: Events[];
}