import { Customer } from "./customer.entity";
import { OrderHeader, OrderLine } from "./order.entity";
import { OrderHeaderRequestDto, OrderLineRequestDto } from "./order.request.dto";
import { OrderHeaderResponseDto, OrderCustomerReponseDto, OrderLineResponseDto, OrderProductResponseDto } from "./order.response.dto";
import { OrderStatus } from "./order.status.enum";
import { Product } from "./product.entity";

export class OrderHeaderMapper {
 static fromDtoRequest(dto: OrderHeaderRequestDto): OrderHeader {
    const entity = new OrderHeader();

    if (!dto) return entity;

    entity.code = dto.code;
    entity.date = dto.date;

    entity.customer = new Customer();
    entity.customer.id = dto.customer_id;

    entity.status = dto.status || OrderStatus.CREATED;

    entity.orderLines = dto.order_lines.map((dtoLine) => {
      const ol: OrderLine = OrderLineMapper.fromDtoRequest(dtoLine);
      ol.orderHeader = entity;
      return ol;
    });

    return entity;
  }

  static toDtoResponse(entity: OrderHeader): OrderHeaderResponseDto {
    const dto = new OrderHeaderResponseDto();

    if (!entity) return dto

    dto.id = entity.id;
    dto.code = entity.code;
    dto.date = entity.date;
    dto.filePdf = entity.filePdf;

    dto.customer = this.toCustomerDtoResponse(entity.customer);

    dto.status = entity.status;

    dto.orderLines = entity.orderLines.map((entityLine) =>
      OrderLineMapper.toDtoResponse(entityLine),
    );

    return dto;
  }

  static toDtoResponses(entities: OrderHeader[]): OrderHeaderResponseDto[] {
    const orderHeaders: OrderHeaderResponseDto[] = [];

    if (!entities) return orderHeaders;

    return entities.map((entityHeader) => this.toDtoResponse(entityHeader));
  }

  static toCustomerDtoResponse(entity: Customer): OrderCustomerReponseDto {
    const customerDto: OrderCustomerReponseDto = new OrderCustomerReponseDto();

    if (!entity) return customerDto;

    customerDto.id = entity.id;
    customerDto.code = entity.code;
    customerDto.name = entity.name;
    customerDto.email = entity.email;

    return customerDto;
  }
}

export class OrderLineMapper {
 static fromDtoRequest(entity: OrderLineRequestDto): OrderLine {
    const ol = new OrderLine();

    if (!entity) return ol;

    ol.product = new Product();
    ol.product.id = entity.product_id;

    ol.quantity = entity.quantity;
    ol.price = entity.price;
    ol.vatRate = entity.vat_rate;

    return ol;
  }

  static toDtoResponse(entity: OrderLine): OrderLineResponseDto {
    const dto = new OrderLineResponseDto();

    if (!entity) return dto;

    dto.id = entity.id;

    dto.product = this.toProductDtoResponse(entity.product);

    dto.quantity = entity.quantity;
    dto.price = entity.price;
    dto.vatRate = entity.vatRate;

    return dto;
  }

  static toDtoResponses(entities: OrderLine[]): OrderLineResponseDto[] {
    const orderLines: OrderLineResponseDto[] = [];

    if (!entities) return orderLines;

    return entities.map((entityLine) => this.toDtoResponse(entityLine));
  }

  static toProductDtoResponse(entity: Product): OrderProductResponseDto {
    const productDto: OrderProductResponseDto = new OrderProductResponseDto();

    if (!entity) return productDto;

    productDto.id = entity.id;
    productDto.code = entity.code;
    productDto.description = entity.description;
    productDto.price = entity.price;

    return productDto;
  }
}