import { HelperDateFormatter } from "../core/helpers/helper-date";
import { HelperNumberFormatter } from "../core/helpers/helper-number";
import { OrderHeader } from "./order.entity";
import { PdfCompanyDto } from "./pdf-company.dto";
import { PdfCustomerDto } from "./pdf-customer.dto";
import { PdfOrderHeaderDto } from "./pdf-orderheader.dto";
import { PdfOderLineDto } from "./pdf-orderline.dto";
import { VatCodeResponseDto } from "./vat-code.response.dto";

export class PdfOrderMapper {
    static fromEntity(order: OrderHeader, listVatCode: VatCodeResponseDto[]): PdfOrderHeaderDto {
        const dto: PdfOrderHeaderDto = new PdfOrderHeaderDto();

        if (!order) return dto;

        dto.company = new PdfCompanyDto()
        dto.company.name = process.env.COMPANY_NAME;
        dto.company.address = process.env.COMPANY_ADDRESS;
        dto.company.email = process.env.COMPANY_EMAIL;

        dto.orderDate = HelperDateFormatter.formatLocalDate(order.date);
        dto.orderNumber = order.code;
        dto.orderStatus = order.status;
        dto.orderPdf = order.filePdf;

        dto.customer = new PdfCustomerDto();
        dto.customer.name = order.customer.name;
        dto.customer.address = order.customer.address;
        dto.customer.email = order.customer.email;

        let bigTotalHTVA: number = 0;
        let bigTotalTVAC: number = 0;
        dto.orderLines = order.orderLines.map((line) => {
            const quantity: number = HelperNumberFormatter.round(line.quantity);
            const price: number = HelperNumberFormatter.roundMoney(line.price);
            const totalHTVA: number = HelperNumberFormatter.roundMoney(quantity * price);
            const vatId: number = line.vatRate;
            const vatRate: number = listVatCode.find(v => v.id === vatId).rate ?? 0;
            const totalTVAC: number = HelperNumberFormatter.roundMoney(quantity * price * (1 + vatRate / 100));

            bigTotalHTVA += totalHTVA;
            bigTotalTVAC += totalTVAC;

            const dtoLine: PdfOderLineDto = new PdfOderLineDto();

            dtoLine.product = line.product.description;
            dtoLine.price = HelperNumberFormatter.formatMoney(price);
            dtoLine.quantity = HelperNumberFormatter.formatInteger(quantity);
            dtoLine.totalHTVA = HelperNumberFormatter.formatMoney(totalHTVA);
            dtoLine.totalTVAC = HelperNumberFormatter.formatMoney(totalTVAC);

            return dtoLine;
        });

        dto.bigTotalHTVA = HelperNumberFormatter.formatMoney(bigTotalHTVA);
        dto.bigTotalTVAC = HelperNumberFormatter.formatMoney(bigTotalTVAC);

        return dto;
    }
}