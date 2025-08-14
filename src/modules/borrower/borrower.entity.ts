import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'borrower' })
export class Borrower extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Limiting with length characters as a security method 
    // to prevent large payload attacks that can crash the server
    @Column({ type: "varchar", nullable: false, length: 100 })
    name: string;

    @Index()
    @Column({ type: "varchar", nullable: false, length: 100, unique: true })
    email: string;
    
    @Column({ type: "varchar", nullable: false, length: 255 })
    password: string;

    // snake_case naming for DB column
    @CreateDateColumn({ type: 'timestamptz', name: 'registered_at' })
    registeredAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;
}
