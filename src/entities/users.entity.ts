import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    OneToMany
} from "typeorm";
import { Dailies } from "./dailies.entity";
import { Events } from "./events.entity";
import { Plans } from "./plans.entity";
import { Works } from "./works.entity";


@Entity({ schema: 'dairy-record', name: 'users' })
export class Users{

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 50 })
    username: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    email: string;  
    
    @Column({ type: 'varchar', length: 100 })
    password: string;  

    @Column({ type: 'tinyint', default: true})
    isActive: Boolean;

    @Column({ type: 'tinyint', default: false})
    isAdmin: Boolean;

    @Column({ type: 'tinyint', default: false})
    isDeleted: Boolean;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Dailies, dailies => dailies.users)
    dailies: Dailies[];

    @OneToMany(() => Plans, plans => plans.users)
    plans: Plans[];
    
    @OneToMany(() => Works, works => works.users)
    works: Works[];
    
    @OneToMany(() => Events, events => events.users)
    events: Events[];
}