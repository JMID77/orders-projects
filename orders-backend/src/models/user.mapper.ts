import { User } from "./user.entity";
import { UserRequestDto } from "./user.request.dto";
import { UserResponseDto } from "./user.response.dto";

export class UserMapper {
    static fromDtoRequest(dto: UserRequestDto): User {
        const entity = new User();

        if (!dto) return entity;

        entity.name = dto.name;
        entity.password = dto.password;
        entity.email = dto.email;
        entity.isAdmin = dto.is_admin;
        entity.isActive = dto.is_active;

        return entity;
    }

    static toDtoResponse(entity: User): UserResponseDto {
        const dto = new UserResponseDto();

        if (!entity) return dto;

        dto.id = entity.id;
        dto.name = entity.name;
        dto.email = entity.email;
        dto.isAdmin = entity.isAdmin;
        dto.isActive = entity.isActive;

        return dto;
    }

    static toDtoResponses(entities: User[]): UserResponseDto[] {
        const users: UserResponseDto[] = [];

        if (!entities) return users;

        return entities.map(entity => this.toDtoResponse(entity));
    }
}