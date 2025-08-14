import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateBorrowerDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string;
    
}
