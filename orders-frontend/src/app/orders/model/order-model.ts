export class CustomerOrder {
    id: number;
    code: string;
    name: string;
    email: string;
}

export class ProductOrder {
    id: number;
    code: string;
    description: string;
    price: number;
}


export class OrderLine {
    id?: number;
    quantity: number;
    price: number;
    vat_rate: number;

    product: ProductOrder;
}

export class OrderHeader {
    id?: number;
    code: string;
    date: string;
    customer: CustomerOrder;
    status: string;

    orderLines: OrderLine[];

    filePdf: string;
}

/* DTOS */
export class CustomerOrderDto {
  id: number;
  code: string;
  name: string;
  email: string;
}

export class ProductOrderDto {
  id: number;
  code: string;
  description: string;
  price: number;
}

export class OrderLineDto {
  id?: number;
  quantity: number;
  price: number;
  vat_rate: number;

  product: ProductOrderDto;
}

export class OrderHeaderDto {
  id?: number;
  code: string;
  date: string;

  customer: CustomerOrderDto;
  status: string;

  order_lines: OrderLineDto[];

  file_pdf: string;
}


export class OrderMapper {

  // -------------------------
  // ORDER HEADER
  // -------------------------
  static fromDto(dto: OrderHeaderDto): OrderHeader {
    const entity = new OrderHeader();

    entity.id = dto.id;
    entity.code = dto.code;
    entity.date = dto.date;
    entity.status = dto.status;
    entity.filePdf = dto.file_pdf;

    entity.customer = OrderMapper.fromCustomerDto(dto.customer);
    entity.orderLines = OrderMapper.fromOrderLineDtos(dto.order_lines);

    return entity;
  }

  static fromDtos(listDto: OrderHeaderDto[]): OrderHeader[] {
    if (!listDto) return [];
    return listDto.map(OrderMapper.fromDto);
  }

  static toDto(entity: OrderHeader): OrderHeaderDto {
    const dto = new OrderHeaderDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.date = entity.date;
    dto.status = entity.status;
    dto.file_pdf = entity.filePdf;

    dto.customer = OrderMapper.toCustomerDto(entity.customer);
    dto.order_lines = OrderMapper.toOrderLineDtos(entity.orderLines);

    return dto;
  }

  // -------------------------
  // CUSTOMER
  // -------------------------
  private static fromCustomerDto(dto: CustomerOrderDto): CustomerOrder {
    const entity = new CustomerOrder();

    entity.id = dto.id;
    entity.code = dto.code;
    entity.name = dto.name;
    entity.email = dto.email;

    return entity;
  }

  private static toCustomerDto(entity: CustomerOrder): CustomerOrderDto {
    const dto = new CustomerOrderDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.name = entity.name;
    dto.email = entity.email;

    return dto;
  }

  // -------------------------
  // PRODUCT
  // -------------------------
  private static fromProductDto(dto: ProductOrderDto): ProductOrder {
    const entity = new ProductOrder();

    entity.id = dto.id;
    entity.code = dto.code;
    entity.description = dto.description;
    entity.price = dto.price;

    return entity;
  }

  private static toProductDto(entity: ProductOrder): ProductOrderDto {
    const dto = new ProductOrderDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.description = entity.description;
    dto.price = entity.price;

    return dto;
  }

  // -------------------------
  // ORDER LINE
  // -------------------------
  private static fromOrderLineDto(dto: OrderLineDto): OrderLine {
    const entity = new OrderLine();

    entity.id = dto.id;
    entity.quantity = dto.quantity;
    entity.price = dto.price;
    entity.vat_rate = dto.vat_rate;

    entity.product = OrderMapper.fromProductDto(dto.product);

    return entity;
  }

  private static fromOrderLineDtos(listDto: OrderLineDto[]): OrderLine[] {
    if (!listDto) return [];
    return listDto.map(OrderMapper.fromOrderLineDto);
  }

  private static toOrderLineDto(entity: OrderLine): OrderLineDto {
    const dto = new OrderLineDto();

    dto.id = entity.id;
    dto.quantity = entity.quantity;
    dto.price = entity.price;
    dto.vat_rate = entity.vat_rate;

    dto.product = OrderMapper.toProductDto(entity.product);

    return dto;
  }

  private static toOrderLineDtos(list: OrderLine[]): OrderLineDto[] {
    if (!list) return [];
    return list.map(OrderMapper.toOrderLineDto);
  }
}