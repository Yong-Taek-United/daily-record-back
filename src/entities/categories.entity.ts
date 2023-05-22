import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from "typeorm";
import { Works } from "./works.entity";
import { Events } from "./events.entity";


@Entity({ schema: 'dairy-record', name: 'categories' })
export class Categories{

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id:number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    color: string;  
  
    @Column({ type: 'tinyint', default: true })
    isActive: Boolean;

    @OneToMany(() => Works, works => works.categories)
    works: Works[];

    @OneToMany(() => Events, events => events.categories)
    events: Events[];
}