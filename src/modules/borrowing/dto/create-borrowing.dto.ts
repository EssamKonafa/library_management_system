import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

export class CreateBorrowedBookDto {

    @IsUUID()
    @IsNotEmpty()
    borrower: string;

    @IsUUID()
    @IsNotEmpty()
    book: string;

    @IsDateString()
    @IsNotEmpty()
    dueDate: Date;

}