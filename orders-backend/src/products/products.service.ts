import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../models/product.entity';
import { ProductRequestDto } from '../models/product.request.dto';
import { ProductResponseDto } from '../models/product.response.dto';
import { Repository } from 'typeorm';
import { ProductMapper } from '../models/product.mapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async getProducts(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      order: { code: 'ASC' },
    });

    return ProductMapper.toDtoResponses(products);
  }

  async getProductByID(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException(`Product id ${id} not found !`);

    return ProductMapper.toDtoResponse(product);
  }

  async createProduct(product: ProductRequestDto): Promise<ProductResponseDto> {
    const isCodeTaken: boolean = await this.productRepository.existsBy({
      code: product.code,
    });
    if (isCodeTaken) {
      throw new ConflictException({
        message: `The code ${product.code} is already used.`,
        field: "code",
      });
    }

    const entity: Product = ProductMapper.fromDtoRequest(product);
    return ProductMapper.toDtoResponse(await this.productRepository.save(entity));
  }

  async updateProduct(
    id: number,
    productDto: ProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOneBy({
      id: id,
    });

    if (!product) {
      throw new NotFoundException(`Product not found to update id ${id}`);
    }

    const updateProduct = this.productRepository.merge(product, productDto);

    return ProductMapper.toDtoResponse(
      await this.productRepository.save(updateProduct),
    );
  }

  async deleteProduct(productId: number): Promise<void> {
    const result = await this.productRepository.delete(productId);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  }

  private logTriggered1(action: string, data: Product | null = null) {
    if (!data) {
      console.log(`ProductsService [${action}] - triggered`);
    } else {
      console.log(
        `ProductsService [${action}] - triggered`,
        JSON.stringify(data),
      );
    }
  }
}
