import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import { Events } from "./events.entity";
import { Users } from "./users.entity";


@Entity({ schema: 'dairy-record', name: 'dailies' })
export class Dailies{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id: number;

    @Column('int',{name: 'year'})
    year: number;

    @Column('int',{name: 'month'})
    month: number;

    @Column('int',{name: 'day'})
    day: number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column({default: false})
    isDeleted: Boolean;

    @ManyToOne(type => Users, users => users.dailies, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    users: Users

    @OneToMany(type => Events, events => events.dailies)
    events: Events[]
}