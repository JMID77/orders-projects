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
import { ProductsService } from './products.service';
import { ProductRequestDto } from '../models/product.request.dto';
import { ProductResponseDto } from '../models/product.response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async getProducts(): Promise<ProductResponseDto[]> {
    const datas = this.productService.getProducts();

    return datas;
  }

  @Get(':id')
  async getProduct(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ProductResponseDto> {
    const data = this.productService.getProductByID(productId);

    return data;
  }

  @Post()
  async postProduct(
    @Body() product: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    console.log("ProductsController [postProduct]", product);
    return await this.productService.createProduct(product);
  }

  @Patch(':id')
  async patchProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body()
    customer: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProduct(productId, customer);
  }

  @Put(':id')
  async putProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() product: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    return await this.productService.updateProduct(productId, product);
  }

  @Delete(':id')
  async deleteProduct(
    @Param('id', ParseIntPipe) ProductId: number,
  ): Promise<void> {
    return await this.productService.deleteProduct(ProductId);
  }
}
