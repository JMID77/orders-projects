import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrderHeader, OrderLine} from '../models/order.entity'
import { OrdersService } from './orders.service';
import { VatCodeModule } from '../core/vat/vat.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHeader, OrderLine]), VatCodeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
