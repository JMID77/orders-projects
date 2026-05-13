import { Customer } from "./customer.entity";
import { CustomerRequestDto } from "./customer.request.dto";
import { CustomerResponseDto } from "./customer.response.dto";

export class CustomerMapper {
    static fromDtoRequest(dto: CustomerRequestDto): Customer {
    const entity = new Customer();

    if (!dto) return entity;

    entity.code = dto.code;
    entity.name = dto.name;
    entity.address = dto.address;
    entity.email = dto.email;

    return entity;
  }

  static toDtoResponse(entity: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    if (!entity) return dto;

    dto.id = entity.id;
    dto.code = entity.code;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.address = entity.address;

    return dto;
  }

  static toDtoResponses(entities: Customer[]): CustomerResponseDto[] {
    const customers: CustomerResponseDto[] = [];

    if (!entities) return customers;

    return entities.map(entity => this.toDtoResponse(entity));
  }
}