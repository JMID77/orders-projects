import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  imports: [OrdersModule]
})
export class PdfModule {}
