import { IsDateString, IsEnum, IsOptional, IsUUID } from "class-validator";
import { BorrowStatus } from "../enum/borrow-status.enum";

export class UpdateBorrowedBookDto {

    @IsUUID()
    @IsOptional()
    borrower?: string;

    @IsUUID()
    @IsOptional()
    book?: string;

    @IsEnum(BorrowStatus)
    @IsOptional()
    status?: BorrowStatus;

    @IsDateString()
    @IsOptional()
    dueDate?: Date;

    @IsDateString()
    @IsOptional()
    returnedAt?: Date;

}