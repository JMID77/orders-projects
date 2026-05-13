export class Product {
    id?: number;
    code: string;
    description: string;
    price: number;
}

/* DTO */
export class ProductDto {
    id?: number;
    code: string;
    description: string;
    price: number;
}

export class ProductMapper {
    static fromDto(dto: ProductDto): Product {
        const entity: Product = new Product();

        entity.id = dto.id;
        entity.description = dto.description;
        entity.code = dto.code;
        entity.price = dto.price;

        return entity;
    }

    static fromDtos(listDto: ProductDto[]): Product[] {
        const entities: Product[] = []
        if (!listDto) return entities;

        return listDto.map((dto) => ProductMapper.fromDto(dto));
    }

    static toDto(entity: Product): ProductDto {
        const dto: ProductDto = new ProductDto();

        dto.id = entity.id;
        dto.code = entity.code;
        dto.description = entity.description;
        dto.price = entity.price;

        return dto;
    }
}