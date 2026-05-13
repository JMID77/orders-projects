import { OrderHeaderDto, OrderMapper } from "./order-model";

export class OrderLineForm {
    id?: number;
    quantity: number;
    price: number;
    vat_rate: number;

    product_id: number;
}

export class OrderHeaderForm {
    code: string;
    date: string;
    customer_id: number;
    status: string;

    order_lines: OrderLineForm[];

    file_pdf: string;
}