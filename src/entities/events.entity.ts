import { 
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne
} from "typeorm";
import { Dailies } from "./dailies.entity";
import { Users } from "./users.entity";
import { Categories } from "./categories.entity";
import { Plans } from "./plans.entity";
import { Works } from "./works.entity";


@Entity({ schema: 'dairy-record', name: 'events' })
export class Events{

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', length: 300, default: null })
    description: string | null;

    @Column({ type: 'tinyint', default: false })
    isChecked: Boolean;

    @Column({ type: 'tinyint', default: false })
    isDeleted: Boolean;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
    
    @ManyToOne(() => Users, users => users.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    users: Users

    @ManyToOne(() => Categories, categories => categories.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    categories: Categories;
    
    @ManyToOne(() => Dailies, dailies => dailies.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    dailies: Dailies;

    @ManyToOne(() => Plans, plans => plans.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    plans: Plans;

    @ManyToOne(() => Works, works => works.events, {
        nullable: true, 
        onDelete: 'SET NULL'
    })
    works: Works;
}