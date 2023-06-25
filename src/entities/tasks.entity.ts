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
import { Projects } from "./projects.entity";
import { Events } from "./events.entity";
import { Goals } from "./goals.entity";


@Entity({ schema: 'daily-record', name: 'TASK' })
export class Tasks{

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
    
    @ManyToOne(() => Users, users => users.tasks, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    user: Users;

    @ManyToOne(() => Categories, categories => categories.tasks, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    category: Categories;

    @ManyToOne(() => Projects, projects => projects.tasks, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    projects: Projects;

    @OneToOne(() => Goals, goals => goals.task)
    goals: Goals;

    @OneToMany(() => Events, events => events.task)
    events: Events[];
}