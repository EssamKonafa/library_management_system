import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateBorrowerDto {

    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(100)
    email?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    password?: string;

}
