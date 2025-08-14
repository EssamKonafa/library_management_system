import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Borrower } from "../borrower/borrower.entity";
import { Book } from "../book/book.entity";
import { BorrowStatus } from "./enum/borrow-status.enum";

@Entity({ name: 'borrowed_book' })
export class BorrowedBook extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Borrower, borrower => borrower.id, { nullable: false, eager: false, onDelete: "CASCADE" })
    borrower: Borrower;

    @ManyToOne(() => Book, book => book.id, { nullable: false, eager: false, onDelete: "CASCADE" })
    book: Book;

    @Column({ type: 'enum', enum: BorrowStatus, default: BorrowStatus.BORROWED })
    status: BorrowStatus;

    @CreateDateColumn({ type: 'timestamptz', name: 'borrowed_at' })
    borrowedAt: Date;

    @Column({ type: 'timestamptz', name: 'due_date', nullable: false })
    dueDate: Date;

    @Column({ type: 'timestamptz', name: 'returned_at', nullable: true })
    returnedAt?: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

}