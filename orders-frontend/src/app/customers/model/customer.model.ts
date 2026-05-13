export class Customer {
    id?: number;
    code: string;
    name: string;
    address: string;
    email: string;
}


/* DTO */
export class CustomerDto {
    id?: number;
    code: string;
    name: string;
    address: string;
    email: string;
}

export class CustomerMapper {
    static fromDto(dto: CustomerDto): Customer {
        const entity: Customer = new Customer();

        entity.id = dto.id;
        entity.code = dto.code;
        entity.name = dto.name;
        entity.email = dto.email;
        entity.address = dto.address;

        return entity;
    }

    static fromDtos(listDto: CustomerDto[]): Customer[] {
        const entities: Customer[] = []
        if (!listDto) return entities;

        return listDto.map((dto) => CustomerMapper.fromDto(dto));
    }

    static toDto(entity: Customer): CustomerDto {
        const dto: CustomerDto = new CustomerDto();

        dto.code = entity.code;
        dto.name = entity.name;
        dto.email = entity.email;
        dto.address = entity.address;

        return dto;
    }
}