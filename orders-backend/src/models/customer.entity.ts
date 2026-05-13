import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseEntityTrack } from './base.entity';

@Entity('customers')
@Unique('UK_Customers_code', ['code'])
export class Customer extends BaseEntityTrack {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 10 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  address!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;
}
