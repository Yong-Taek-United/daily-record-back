import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn,
    ManyToOne
} from "typeorm";
import { Dailies } from "./dailies.entity";
import { Users } from "./users.entity";
import { Categories } from "./categories.entity";
import { Plans } from "./plans.entity";
import { Works } from "./works.entity";


@Entity({ schema: 'dairy-record', name: 'events' })
export class Events{
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

    @Column({default: false})
    isChecked: Boolean;

    @Column({default: false})
    isDeleted: Boolean;
    
    @ManyToOne(type => Users, users => users.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    users: Users

    @ManyToOne(type => Categories, categories => categories.events, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    categories: Categories
    
    @ManyToOne(type => Dailies, dailies => dailies.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    dailies: Dailies

    @ManyToOne(type => Plans, plans => plans.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    plans: Plans

    @ManyToOne(type => Works, works => works.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    works: Works
}