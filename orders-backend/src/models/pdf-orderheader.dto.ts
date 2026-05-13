import { PdfCompanyDto } from "./pdf-company.dto";
import { PdfCustomerDto } from "./pdf-customer.dto";
import { PdfGeneric } from "./pdf-generic.dto";
import { PdfOderLineDto } from "./pdf-orderline.dto";



export class PdfOrderHeaderDto extends PdfGeneric {
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    orderPdf: string;

    company: PdfCompanyDto;
    customer: PdfCustomerDto;

    orderLines: PdfOderLineDto[];

    bigTotalHTVA: string;
    bigTotalTVAC: string;
}