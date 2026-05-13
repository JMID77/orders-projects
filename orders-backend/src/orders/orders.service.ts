import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderHeader, OrderLine } from '../models/order.entity';
import { OrderHeaderResponseDto } from '../models/order.response.dto';
import { OrderHeaderRequestDto } from '../models/order.request.dto';
import { OrderHeaderMapper, OrderLineMapper } from '../models/order.mapper';
import { PdfOrderHeaderDto } from '../models/pdf-orderheader.dto';
import { PdfOrderMapper } from '../models/pdf-order.mapper';
import { VatCodeService } from '../core/vat/vat.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderHeader)
    private readonly orderRepository: Repository<OrderHeader>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepository: Repository<OrderLine>,
    private vatCodeService: VatCodeService,
  ) { }

  async getOrders(): Promise<OrderHeaderResponseDto[]> {
    this.logTriggered('getOrders');
    const orders = await this.orderRepository.find({ order: { code: 'ASC' } });

    return OrderHeaderMapper.toDtoResponses(orders);
  }

  async getOrder(id: number): Promise<OrderHeaderResponseDto> {
    this.logTriggered('getOrder');
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) throw new NotFoundException(`Order id ${id} not found !`);

    return OrderHeaderMapper.toDtoResponse(order);
  }

  async createOrder(
    orderDto: OrderHeaderRequestDto,
  ): Promise<OrderHeaderResponseDto> {
    this.logTriggered('createOrder');

    const isCodeTaken: boolean = await this.orderRepository.existsBy({
      code: orderDto.code,
    });
    if (isCodeTaken) {
      throw new ConflictException({
        message: `The code ${orderDto.code} is already used.`,
        field: "code",
      });
    }

    const entity: OrderHeader = OrderHeaderMapper.fromDtoRequest(orderDto);
    return OrderHeaderMapper.toDtoResponse(await this.orderRepository.save(entity));
  }

  async updateOrder(
    id: number,
    orderDto: OrderHeaderRequestDto,
  ): Promise<OrderHeaderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        orderLines: true
      }
    });

    this.logTriggered('updateOrder');

    if (!order) {
      throw new NotFoundException(`Order not found to update id ${id}`);
    }

    order.code = orderDto.code;
    order.date = orderDto.date;
    order.status = orderDto.status;
    order.customer = { id: orderDto.customer_id } as any;

    // 3. Mapper les lignes du DTO vers l'objet existant
    // TRÈS IMPORTANT : il faut que chaque ligne pointe vers l'objet 'order'
    order.orderLines = orderDto.order_lines.map((lineDto) => {
      const line = OrderLineMapper.fromDtoRequest(lineDto);
      line.id = lineDto.id; // On garde l'ID pour l'update, sinon ça crée des doublons
      line.orderHeader = order; // On lie physiquement la ligne à la commande chargée
      return line;
    });

    return OrderHeaderMapper.toDtoResponse(
      await this.orderRepository.save(order),
    );
  }

  async updateFilePDF(orderId: number, filePdf: string): Promise<void> {
    const result = await this.orderRepository.update(
      {id: orderId},
      {filePdf: filePdf}
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Order not found to update id ${orderId}`);
    }
  }

  async deleteOrder(orderId: number): Promise<void> {
    // 1. Supprimer d'abord toutes les lignes liées à cette commande
    const resultLines = this.orderLineRepository.delete({ orderHeader: { id: orderId } });

    // 2. Supprimer ensuite la commande elle-même
    const resultOrder = await this.orderRepository.delete(orderId);

    if (resultOrder.affected === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }

  async deleteOrderLine(orderId: number, lineId: number): Promise<OrderLine> {
    console.log(`deleteOrderLine(${orderId}, ${lineId})`);

    const line = await this.orderLineRepository.findOne({
      where: {
        id: lineId,
        orderHeader: { id: orderId } // Vérification stricte de l'appartenance
      }
    });

    if (!line) {
      throw new NotFoundException(`Ligne ${lineId} non trouvée pour la commande ${orderId}`);
    }

    return await this.orderLineRepository.remove(line);
  }

  formatStatusLabel(key: string): string {
    // Transforme "SHIPPED" en "Expédiée", "CREATED" en "Créée", etc.
    const labels: Record<string, string> = {
      CREATED: 'Créée',
      VALIDATED: 'Validée',
      SHIPPED: 'Expédiée',
      CANCELLED: 'Annulée'
    };
    return labels[key] || key;
  }

  async loadPdfOrder(orderId: number): Promise<PdfOrderHeaderDto> {
    this.logTriggered('getOrder');
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    const listVatCode = await this.vatCodeService.getVatCodes();

    if (!order) throw new NotFoundException(`Order id ${orderId} not found !`);

    const dto: PdfOrderHeaderDto = PdfOrderMapper.fromEntity(order, listVatCode);
    
    return dto;
  }

  private logTriggered(action: string, data: OrderHeader | null = null) {
    if (!data) {
      console.log(`OrdersService [${action}] - triggered`);
    } else {
      console.log(
        `OrdersService [${action}] - triggered`,
        JSON.stringify(data),
      );
    }
  }
}
