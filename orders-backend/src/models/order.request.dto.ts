import {
  IsInt,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
  IsDate,
  IsOptional,
  IsEnum,
  IsDecimal
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from './order.status.enum';

export class OrderLineRequestDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  product_id!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  price!: number;

  @IsNumber()
  vat_rate: number;
}

export class OrderHeaderRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @MaxLength(20, { message: "The 'code' must be a maximum of 10 characters." })
  @MinLength(3, { message: "The 'code' must be a minimum of 3 characters." })
  code!: string;

  @IsInt()
  customer_id!: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: 'The status must be one of these values : CREATED, VALIDATED, SHIPPED ou CANCELLED'
  })
  status: OrderStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineRequestDto)
  order_lines!: OrderLineRequestDto[];
}