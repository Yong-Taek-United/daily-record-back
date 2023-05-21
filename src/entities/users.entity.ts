import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn,
    OneToMany
} from "typeorm";
import { Dailies } from "./dailies.entity";
import { Events } from "./events.entity";
import { Plans } from "./plans.entity";
import { Works } from "./works.entity";


@Entity({ schema: 'dairy-record', name: 'users' })
export class Users{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar',{name: 'username', length: 45})
    username:string;

    @Column('varchar', {name: 'email', unique: true, length: 45})
    email:string;  
    
    @Column('varchar', {name: 'password', length: 100})
    password:string;  

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column({default: true})
    isActive: Boolean;

    @Column({default: false})
    isAdmin: Boolean;

    @OneToMany(type => Dailies, dailies => dailies.users)
    dailies: Dailies[]

    @OneToMany(type => Plans, plans => plans.users)
    plans: Plans[]
    
    @OneToMany(type => Works, works => works.users)
    works: Works[]
    
    @OneToMany(type => Events, events => events.users)
    events: Events[]
}