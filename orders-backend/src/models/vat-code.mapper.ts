import { VatCode } from "./vat-code.entity";
import { VatCodeRequestDto } from "./vat-code.request.dto";
import { VatCodeResponseDto } from "./vat-code.response.dto";


export class VatCodeMapper {
    static toDtoResponse(entity: VatCode): VatCodeResponseDto {
        const dto = new VatCodeResponseDto();

        if (!entity) return dto

        dto.id = entity.id;
        dto.code = entity.code;
        dto.description = entity.description;
        dto.rate = typeof entity.rate === 'string' ? parseFloat(entity.rate) : entity.rate;
        dto.isActive = entity.isActive;

        return dto;
    }

    static toDtoResponses(entities: VatCode[]): VatCodeResponseDto[] {
        const dtos: VatCodeResponseDto[] = [];

        if (!entities) return dtos;

        return entities.map((entity) => VatCodeMapper.toDtoResponse(entity));
    }

    static fromDtoRequest(dto: VatCodeRequestDto): VatCode {
        const entity = new VatCode();

        if (!dto) return

        entity.code = dto.code;
        entity.description = dto.description;
        entity.rate = dto.rate;
        entity.isActive = dto.is_active;

        return entity;
    }
}