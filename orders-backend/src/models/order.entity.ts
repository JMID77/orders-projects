import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { OrderStatus } from './order.status.enum';
import { BaseEntityTrack } from './base.entity';


@Entity()
@Unique('UK_OrderHeader_code', ['code'])
@Index('IDX_OrderHeader_date', ['date'])
export class OrderHeader extends BaseEntityTrack {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  code!: string;

  @ManyToOne(() => Customer, { eager: true })
  customer!: Customer;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED
  })
  status: OrderStatus;

  @OneToMany(() => OrderLine, (line) => line.orderHeader, {
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  orderLines!: OrderLine[];

  @Column({ name: 'file_pdf', nullable: true })
  filePdf?: string;
}

@Entity()
@Index('IDX_OrderLine_orderHeader', ['orderHeader'])
export class OrderLine extends BaseEntityTrack {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Product, { eager: true })
  product!: Product;

  @Column({
    type: 'decimal',
    precision: 12, // Nombre total de chiffres
    scale: 2, // Nombre de chiffres après la virgule
    default: 0,
    transformer: {
      // TypeORM récupère le decimal sous forme de string,
      // ce transformateur le convertit en nombre pour le frontend
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 12, // Nombre total de chiffres
    scale: 2, // Nombre de chiffres après la virgule
    default: 0,
    transformer: {
      // TypeORM récupère le decimal sous forme de string,
      // ce transformateur le convertit en nombre pour le frontend
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price!: number;

  @Column({
    name: 'vat_rate', type: 'decimal', precision: 5, scale: 2, nullable: true, transformer: {
      // TypeORM récupère le decimal sous forme de string,
      // ce transformateur le convertit en nombre pour le frontend
      to: (value: number) => value,
      from: (value: string) => (value !== null ? parseFloat(value) : null),
    },
  })
  vatRate: number

  @ManyToOne(() => OrderHeader, (header) => header.orderLines, {
    onDelete: 'CASCADE',
    nullable: false // Empêche le passage à NULL, force la suppression
  })
  orderHeader!: OrderHeader;
}
