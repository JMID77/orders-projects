import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class VatCodeResponseDto {
    id?: number;
    code: string;
    description: string;
    rate: number;
    @Expose({name: 'is_active'})
    isActive: boolean
}