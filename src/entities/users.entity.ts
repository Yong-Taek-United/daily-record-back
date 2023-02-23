import { Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn
} from "typeorm";


@Entity({ schema: 'dairy-record', name: 'users' })
export class Users{
    @PrimaryGeneratedColumn({type:'int',name:'id'})
    id:number;

    @Column('varchar',{name: 'username', length: 45})
    username:string;

    @Column('varchar', {name: 'email', unique: true, length: 45})
    email:string;  
    
    @Column('varchar', {name: 'password', length: 100})
    password:string;  

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;

    @Column({default: true})
    isActive: Boolean;
}