import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne,
    OneToMany,
    OneToOne
} from "typeorm";
import { Users } from "./users.entity";
import { Categories } from "./categories.entity";
import { Plans } from "./plans.entity";
import { Events } from "./events.entity";
import { Goals } from "./goals.entity";


@Entity({ schema: 'dairy-record', name: 'works' })
export class Works{

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', length: 300, default: null })
    description: string | null;

    @Column({ type: 'tinyint', default: true })
    isActive: Boolean;

    @Column({ type: 'tinyint', default: false })
    isComplated: Boolean;

    @Column({ type: 'tinyint', default: false })
    isDeleted: Boolean;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
    
    @ManyToOne(() => Users, users => users.works, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    users: Users;

    @ManyToOne(() => Categories, categories => categories.works, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    categories: Categories;

    @ManyToOne(() => Plans, plans => plans.works, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    plans: Plans;

    @OneToOne(() => Goals, goals => goals.works)
    goals: Goals;

    @OneToMany(() => Events, events => events.works)
    events: Events[];
}