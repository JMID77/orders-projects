import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerRequestDto } from '../models/customer.request.dto';
import { CustomerResponseDto } from '../models/customer.response.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Get()
  async getCustomers(): Promise<CustomerResponseDto[]> {
    const datas = this.customerService.getCustomers();

    return datas;
  }

  @Get(':id')
  async getCustomer(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<CustomerResponseDto> {
    const datas = this.customerService.getCustomer(customerId);

    return datas;
  }

  @Post()
  async postCustomer(
    @Body() customer: CustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.createCustomer(customer);
  }

  @Patch(':id')
  async patchCustomer(
    @Param('id', ParseIntPipe) customerId: number,
    @Body()
    customer: CustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.updateCustomer(customerId, customer);
  }

  @Put(':id')
  async putCustomer(
    @Param('id', ParseIntPipe) customerId: number,
    @Body() customer: CustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.updateCustomer(customerId, customer);
  }

  @Delete(':id')
  async deleteCustomer(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<void> {
    return this.customerService.deleteCustomer(customerId);
  }
}
