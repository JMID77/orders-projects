import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderHeaderResponseDto } from '../models/order.response.dto';
import { OrderHeaderRequestDto } from '../models/order.request.dto';
import { OrderStatus, StatusOption } from '../models/order.status.enum';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @Get()
  async getOrders(): Promise<OrderHeaderResponseDto[]> {
    const datas = this.ordersService.getOrders();

    return datas;
  }

  @Get('statuses')
  async getOrderStatuses(): Promise<StatusOption[]> {
    return Object.values(OrderStatus).map((value) => ({
      label: this.ordersService.formatStatusLabel(value), // Optionnel : pour rendre le texte plus "humain"
      value: value
    }));
  }

  @Get(':id')
  async getOrder(
    @Param('id', ParseIntPipe) orderId: number,
  ): Promise<OrderHeaderResponseDto> {
    const data = this.ordersService.getOrder(orderId);

    return data;
  }

  @Post()
  async postOrder(
    @Body() orderDto: OrderHeaderRequestDto,
  ): Promise<OrderHeaderResponseDto> {
    console.log("Controller [ORDERS] >>> ", orderDto);
    return this.ordersService.createOrder(orderDto);
  }


  @Put(':id')
  async putOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() order: OrderHeaderRequestDto,
  ): Promise<OrderHeaderResponseDto> {
    return this.ordersService.updateOrder(orderId, order);
  }

  @Delete(':orderId/lines/:lineId')
  async removeLine(
    @Param('orderId') orderId: string,
    @Param('lineId') lineId: string
  ) {
    return await this.ordersService.deleteOrderLine(parseInt(orderId), parseInt(lineId));
  }

  @Delete(':orderId')
  async removeOrder(
    @Param('orderId') orderId: string
  ) {
    return await this.ordersService.deleteOrder(parseInt(orderId));
  }
}
