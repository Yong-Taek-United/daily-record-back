import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn,
    ManyToOne
} from "typeorm";
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

    @ManyToOne(type => Users, users => users.dailies)
    users: Users
}