import { IsString, IsNotEmpty, MaxLength, MinLength, IsEmail, IsOptional } from "class-validator";

export class AuthLoginDto {
    @IsEmail({}, { message: 'The email format is invalid.' })
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'The \'password\' must be a maximum of 50 characters.' })
    @MinLength(5, { message: 'The \'password\' must be a minimum of 5 characters.' })
    password: string;
}