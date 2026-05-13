import { Module } from '@nestjs/common';
import { VatCodeController } from './vat.controller';
import { VatCodeService } from './vat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VatCode } from '../../models/vat-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VatCode])],
  controllers: [VatCodeController],
  providers: [VatCodeService],
  exports: [VatCodeService]
})
export class VatCodeModule {}
