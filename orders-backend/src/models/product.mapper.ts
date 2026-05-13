import { Product } from "./product.entity";
import { ProductRequestDto } from "./product.request.dto";
import { ProductResponseDto } from "./product.response.dto";


export class ProductMapper {
    static fromDtoRequest(dto: ProductRequestDto): Product {
        const entity = new Product();

        if (!dto) return entity;

        entity.code = dto.code;
        entity.description = dto.description;
        entity.price = dto.price;

        return entity;
    }

    static toDtoResponse(entity: Product): ProductResponseDto {
        const dto = new ProductResponseDto();

        if (!entity) return dto;

        dto.id = entity.id;
        dto.code = entity.code!;
        dto.description = entity.description!;
        dto.price = entity.price!;

        return dto;
    }

    static toDtoResponses(entities: Product[]): ProductResponseDto[] {
        const products: ProductResponseDto[] = [];

        if (!entities) return products;

        return entities.map(entity => this.toDtoResponse(entity));;
    }
}