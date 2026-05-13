import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Get('order/:id')
    async generateOrder(@Param('id', ParseIntPipe) orderId: number, @Res() response: Response) {
        const pdf = await this.pdfService.generateOrderPdf(orderId);

        response.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=order-${orderId}.pdf`,
            'Content-Length': pdf.length,
        })
        
        response.end(pdf);
    }
}
