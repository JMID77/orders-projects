import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VatCode } from '../../models/vat-code.entity';
import { VatCodeMapper } from '../../models/vat-code.mapper';
import { VatCodeResponseDto } from '../../models/vat-code.response.dto';
import { VatCodeRequestDto } from '../../models/vat-code.request.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VatCodeService {
    constructor(@InjectRepository(VatCode) private readonly vatCodeRepository: Repository<VatCode>) { }

    async getVatCodes(): Promise<VatCodeResponseDto[]> {
        const datas = await this.vatCodeRepository.find({ order: { code: 'ASC' } });

        return VatCodeMapper.toDtoResponses(datas);
    }

    async getVatCodeById(vatId: number): Promise<VatCodeResponseDto> {
        const data = await this.vatCodeRepository.findOne({ where: { id: vatId } });

        return VatCodeMapper.toDtoResponse(data);
    }

    async createVatCode(vat: VatCodeRequestDto): Promise<VatCodeResponseDto> {
        const isCodeToken: boolean = await this.vatCodeRepository.existsBy({ code: vat.code });
        if (isCodeToken) {
            throw new ConflictException({
                message: `The code ${vat.code} is already used.`,
                field: "code",
            })
        }

        const entity: VatCode = VatCodeMapper.fromDtoRequest(vat);
        return VatCodeMapper.toDtoResponse(await this.vatCodeRepository.save(entity));
    }

    async updateVatCode(vatId: number, dto: VatCodeRequestDto): Promise<VatCodeResponseDto> {
        const entity = await this.vatCodeRepository.findOneBy({ id: vatId });

        if (!entity) {
            throw new NotFoundException(`Vat code not found to update id ${vatId}`);
        }

        const updateVat = this.vatCodeRepository.merge(entity, VatCodeMapper.fromDtoRequest(dto));

        return VatCodeMapper.toDtoResponse(await this.vatCodeRepository.save(updateVat));
    }

    async deleteVatCode(vatId: number): Promise<void> {
        const result = await this.vatCodeRepository.delete(vatId);

        if (result.affected === 0) {
            throw new NotFoundException(`Vat code with ID ${vatId} not found`);
        }
    }

}
