import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    author: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    ISBN: string;

    @Min(0)
    @IsNumber()
    availableQuantity: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    shelfLocation: string;

}