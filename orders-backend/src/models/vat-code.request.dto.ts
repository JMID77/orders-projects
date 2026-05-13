import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class VatCodeRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(3, { message: 'The \'vat code\' must be a maximum of 3 characters.' })
    @MinLength(2, { message: 'The \'vat code\' must be a minimum of 2 characters.' })
    code: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(250, { message: 'The \'vat description\' must be a maximum of 250 characters.' })
    description: string;

    @IsNumber()
    rate: number;

    @IsBoolean()
    is_active: boolean;
}