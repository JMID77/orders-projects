import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../models/customer.entity';
import { CustomerRequestDto } from '../models/customer.request.dto';
import { CustomerResponseDto } from '../models/customer.response.dto';
import { Repository } from 'typeorm';
import { CustomerMapper } from '../models/customer.mapper';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) { }

  async getCustomers(): Promise<CustomerResponseDto[]> {
    this.logTriggered('getCustomers');
    const customers = await this.customerRepository.find({
      order: { code: 'ASC' },
    });

    return CustomerMapper.toDtoResponses(customers);
  }

  async getCustomer(id: number): Promise<CustomerResponseDto> {
    this.logTriggered('getCustomer');
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) throw new NotFoundException(`Customer id ${id} not found !`);

    return CustomerMapper.toDtoResponse(customer);
  }

  async createCustomer(
    customer: CustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    this.logTriggered('createCustomer');

    const isCodeTaken: boolean = await this.customerRepository.existsBy({
      code: customer.code,
    });
    if (isCodeTaken) {
      throw new ConflictException({
        message: `The code ${customer.code} is already used.`,
        field: "code",
      });
    }

    const entity: Customer = CustomerMapper.fromDtoRequest(customer);
    return CustomerMapper.toDtoResponse(await this.customerRepository.save(entity));

  }

  async updateCustomer(
    id: number,
    customerDto: CustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findOneBy({
      id: id,
    });

    this.logTriggered('updateCustomer');

    if (!customer) {
      throw new NotFoundException(`Customer not found to update id ${id}`);
    }

    const updateCustomer = this.customerRepository.merge(customer, customerDto);

    return CustomerMapper.toDtoResponse(
      await this.customerRepository.save(updateCustomer),
    );
  }

  async deleteCustomer(customerId: number): Promise<void> {
    const result = await this.customerRepository.delete(customerId);

    if (result.affected === 0) {
      console.log('CustomersService [deleteCustomer]', 'NoDataFound')
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }
  }

  private logTriggered(action: string, data: Customer | null = null) {
    if (!data) {
      console.log(`CustomersService [${action}] - triggered`);
    } else {
      console.log(
        `CustomersService [${action}] - triggered`,
        JSON.stringify(data),
      );
    }
  }
}
