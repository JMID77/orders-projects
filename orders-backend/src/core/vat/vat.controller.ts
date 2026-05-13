import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { VatCodeService } from './vat.service';
import { VatCodeResponseDto } from '../../models/vat-code.response.dto';
import { VatCodeRequestDto } from '../../models/vat-code.request.dto';

@Controller('vat')
export class VatCodeController {
    constructor(private readonly vatService: VatCodeService) { }

    @Get()
    async getAll(): Promise<VatCodeResponseDto[]> {
        return await this.vatService.getVatCodes();
    }

    @Get(':id')
    async getVatCode(@Param('id', ParseIntPipe) vatId: number): Promise<VatCodeResponseDto> {
        return await this.vatService.getVatCodeById(vatId);
    }

    @Post()
    async postVatCode(@Body() vat: VatCodeRequestDto): Promise<VatCodeResponseDto> {
        return await this.vatService.createVatCode(vat);
    }

    @Put(':id')
    async putVatCode(@Param('id') vatId: number, @Body() vat: VatCodeRequestDto): Promise<VatCodeResponseDto> {
        return await this.vatService.updateVatCode(vatId, vat);
    }
    
    @Patch(':id')
    async patchVatCode(@Param('id') vatId: number, @Body() vat: VatCodeRequestDto): Promise<VatCodeResponseDto> {
        return await this.vatService.updateVatCode(vatId, vat);
    }

    @Delete(':id')
    async deleteVatCode(@Param('id') vatId: number): Promise<void> {
        return await this.vatService.deleteVatCode(vatId);
    }
}
