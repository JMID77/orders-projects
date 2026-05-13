import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseEntityTrack } from './base.entity';

@Entity('products')
@Unique('UK_Products_code', ['code'])
export class Product extends BaseEntityTrack {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 10 })
  code!: string;

  @Column({ type: 'varchar', length: 250 })
  description!: string;

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
}
