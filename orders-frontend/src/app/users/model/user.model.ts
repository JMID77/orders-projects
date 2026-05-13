export class User {
    id?: number;
    name: string;
    email: string;
    isAdmin: boolean;
    isActive: boolean;
}

/* DTO */
export class UserDto {
    id?: number;
    name: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
}


export class UserMapper {
    static fromDto(dto: UserDto): User {
        const entity: User = new User();

        entity.id = dto.id;
        entity.name = dto.name;
        entity.email = dto.email;
        entity.isAdmin = dto.is_admin;
        entity.isActive = dto.is_active;

        return entity;
    }

    static fromDtos(listDto: UserDto[]): User[] {
        const entities: User[] = []
        if (!listDto) return entities;

        return listDto.map((dto) => UserMapper.fromDto(dto));
    }

    static toDto(entity: User): UserDto {
        const dto: UserDto = new UserDto();

        dto.name = entity.name;
        dto.email = entity.email;
        dto.is_admin = entity.isAdmin;
        dto.is_active = entity.isActive;

        return dto;
    }
}