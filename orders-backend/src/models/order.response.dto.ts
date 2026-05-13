import { Expose, Transform } from 'class-transformer';
import { OrderStatus } from './order.status.enum';


export class OrderCustomerReponseDto {
  id?: number;
  code!: string;
  name!: string;
  email!: string;
}

export class OrderProductResponseDto {
  id?: number;
  code!: string;
  description!: string;
  price!: number;
}

export class OrderLineResponseDto {
  id?: number;
  product!: OrderProductResponseDto;
  quantity!: number;
  price!: number;
  @Expose({name: 'vat_rate'})
  vatRate: number;
}

export class OrderHeaderResponseDto {
  id?: number;
  code!: string;
  @Transform(({ value }) => value.toISOString()) // Garantit un format ISO propre
  date!: Date;
  customer!: OrderCustomerReponseDto;
  status: OrderStatus;
  @Expose({name: 'order_lines'})
  orderLines!: OrderLineResponseDto[];
  @Expose({name: 'file_pdf'})
  filePdf: string;
}
