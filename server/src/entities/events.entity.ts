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


@Entity({ schema: 'dairy-record', name: 'events' })
export class Events{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar',{name: 'description', length: 200})
    description:string;

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
        nullable: false, 
        onDelete: 'CASCADE'
    })
    users: Users

    @ManyToOne(type => Dailies, dailies => dailies.events, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    dailies: Dailies
}