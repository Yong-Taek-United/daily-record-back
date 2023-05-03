import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Users } from "./users.entity";
import { Categories } from "./categories.entity";
import { Plans } from "./plans.entity";
import { Events } from "./events.entity";


@Entity({ schema: 'dairy-record', name: 'works' })
export class Works{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar',{name: 'title', length: 100})
    title:string;

    @Column('varchar',{name: 'description', length: 300, default: null})
    description:string | null;

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

    @Column({default: false})
    isDeleted: Boolean;
    
    @ManyToOne(type => Users, users => users.works, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    users: Users

    @ManyToOne(type => Categories, categories => categories.works, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    categories: Categories

    @ManyToOne(type => Plans, plans => plans.works, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    plans: Plans

    @OneToMany(type => Events, events => events.works)
    events: Events[]
}