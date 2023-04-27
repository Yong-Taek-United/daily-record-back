import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Users } from "./users.entity";
import { Works } from "./works.entity";
import { Events } from "./events.entity";


@Entity({ schema: 'dairy-record', name: 'plans' })
export class Plans{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar',{name: 'title', length: 100})
    title:string;

    @Column('varchar',{name: 'description', length: 300, default: null})
    description:string | null;

    @Column()
    startedAt: Date;
  
    @Column()
    finishedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column({default: true})
    isActive: Boolean;

    @Column({default: false})
    isComplated: Boolean;

    @OneToMany(type => Works, works => works.users)
    works: Works[]

    @OneToMany(type => Events, events => events.categories)
    events: Events[]
    
    @ManyToOne(type => Users, users => users.plans, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    users: Users
}