import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'book' })
export class Book extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Limiting with length characters as a security method 
    // to prevent large payload attacks that can crash the server
    @Column({ type: "varchar", nullable: false, length: 150 })
    @Index()
    title: string;

    //index for boost up filtering performance
    @Index()
    @Column({ type: "varchar", nullable: false, length: 100 })
    author: string;
    
    @Index()
    @Column({ type: "varchar", nullable: false, length: 100, name: 'isbn' })
    ISBN: string;

    // snake_case naming for DB column
    @Column({ type: 'int', nullable: false, name: 'available_quantity', default: 0 })
    availableQuantity: number;

    @Column({ type: 'varchar', nullable: false, length: 100, name: 'shelf_location' })
    shelfLocation: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

}