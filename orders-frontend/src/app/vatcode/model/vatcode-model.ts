export class VatCode {
    id?: number;
    code: string;
    description: string;
    rate: number;
    isActive: boolean;
}

export class VatCodeDto {
    id?: number;
    code: string;
    description: string;
    rate: number;
    is_active: boolean;
}

export class VatCodeMapper {
    static fromDto(dto: VatCodeDto): VatCode {
        const entity: VatCode = new VatCode();

        entity.id = dto.id;
        entity.code = dto.code;
        entity.description = dto.description;
        entity.rate = dto.rate;
        entity.isActive = dto.is_active;

        return entity;
    }

    static fromDtos(listDto: VatCodeDto[]): VatCode[] {
        const entities: VatCode[] = []
        if (!listDto) return entities;

        return listDto.map((dto) => VatCodeMapper.fromDto(dto));
    }

    static toDto(entity: VatCode): VatCodeDto {
        const dto: VatCodeDto = new VatCodeDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.description = entity.description;
        dto.rate = entity.rate;
        dto.is_active = entity.isActive;

        return dto;
    }
}