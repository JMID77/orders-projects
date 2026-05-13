import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('vat_code')
@Unique('UK_vat_code', ['code'])
export class VatCode extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 3})
    code: string;

    @Column({length: 250})
    description: string;

    @Column('decimal', {precision: 5, scale: 2})
    rate: number;

    @Column({name: 'is_active', default: true})
    isActive: boolean;
}