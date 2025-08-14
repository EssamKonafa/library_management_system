import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateBookDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    author?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    ISBN?: string;

    @IsOptional()
    @Min(0)
    @IsNumber()
    availableQuantity?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    shelfLocation?: string;

}