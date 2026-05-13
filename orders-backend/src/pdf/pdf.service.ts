import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { OrdersService } from '../orders/orders.service';
import { PdfGeneric } from '../models/pdf-generic.dto';
import { HelperNumberFormatter } from '../core/helpers/helper-number';
import { HelperDateFormatter } from '../core/helpers/helper-date';
import { OrderStatus } from '../models/order.status.enum';


export enum TypePdf {
    ORDER_HEADER = 'order',
}

@Injectable()
export class PdfService {
    constructor(private readonly orderService: OrdersService) { }

    async generateOrderPdf(orderId: number): Promise<Buffer> {
        const datas = await this.orderService.loadPdfOrder(orderId);
        const orderStatus = datas.orderStatus;
        const orderPdf = datas.orderPdf;

        let fileName: string = '';
        let pdfBuffer = null;
        if ((orderStatus === OrderStatus.CREATED || orderStatus === OrderStatus.VALIDATED) || ((orderStatus === OrderStatus.SHIPPED || orderStatus === OrderStatus.CANCELLED) && orderPdf === '')) {
            fileName = `ORDER-${HelperNumberFormatter.formatWithLeadingZero(orderId, 8)}-${HelperDateFormatter.formatDateHorodatage(new Date())}`;
            pdfBuffer = this.generatePdf(datas, TypePdf.ORDER_HEADER, fileName);
            this.orderService.updateFilePDF(orderId, `${fileName}.pdf`);
        } else if (orderStatus === OrderStatus.SHIPPED || orderStatus === OrderStatus.CANCELLED) {
            fileName = orderPdf;
            pdfBuffer = this.getArchivePdf(fileName, TypePdf.ORDER_HEADER);
        }

        return pdfBuffer
    }

    private async generatePdf(datas: PdfGeneric, typePdf: string, fileName: string = ''): Promise<Buffer> {
        // Load template
        const pathPdf: string = process.env.TEMPLATE_PDF_PATH;
        const pathArchive: string = process.env.PDF_PATH_ARCHIVES;

        const filePath = path.join(process.cwd(), pathPdf.replace('[TYPE]', typePdf));
        const outputPathPdf = path.join(process.cwd(), pathArchive.replace('[FILE_NAME]', fileName));

        const html = fs.readFileSync(filePath, 'utf-8');

        // Compile template
        const template = Handlebars.compile(html);
        const finalHtml = template(datas);

        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
        });

        try {
            const page = await browser.newPage();

            await page.setContent(finalHtml, {
                waitUntil: 'networkidle0',
            });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            await browser.close();

            this.ensureDirectoryExists(path.dirname(outputPathPdf));
            fs.writeFileSync(outputPathPdf, pdf);

            return Buffer.from(pdf);
        } finally {
            await browser.close();
        }
    }

    private async getArchivePdf(filePdf: string, typePdf: TypePdf): Promise<Buffer> {
        // Load template
        const pathArchive: string = process.env.PDF_PATH_ARCHIVES;

        filePdf = filePdf.replace('.pdf', '');
        const archivePathPdf = path.join(process.cwd(), pathArchive.replace('[FILE_NAME]', filePdf));

        const pdfBuffer = fs.readFileSync(archivePathPdf);

        return pdfBuffer;
    }

    private async ensureDirectoryExists(path: string): Promise<void> {
        await fs.promises.mkdir(path, { recursive: true });
    }
}
