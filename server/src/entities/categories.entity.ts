import { Entity, 
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from "typeorm";
import { Works } from "./works.entity";
import { Events } from "./events.entity";


@Entity({ schema: 'dairy-record', name: 'categories' })
export class Categories{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar',{name: 'name', length: 45})
    name: string;

    @Column('varchar', {name: 'color', unique: true, length: 45})
    color: string;  
  
    @Column({default: true})
    isActive: Boolean;

    @OneToMany(type => Works, works => works.categories)
    works: Works[]

    @OneToMany(type => Events, events => events.categories)
    events: Events[]
}