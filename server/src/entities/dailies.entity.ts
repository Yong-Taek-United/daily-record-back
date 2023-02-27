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
    id:number;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column({default: false})
    isDeleted: Boolean;

    @ManyToOne(type => Users, users => users.dailies, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    users: Users

    @OneToMany(type => Events, events => events.dailies)
    events: Events[]
}