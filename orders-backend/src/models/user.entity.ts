import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseEntityTrack } from './base.entity';

@Entity('users')
@Unique('UK_Users_Email', ['email'])
export class User extends BaseEntityTrack {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 250, default: '' })
  password: string;

  @Column({type:'boolean', default: false})
  isAdmin: boolean;

  @Column({type:'boolean', default: true})
  isActive: boolean;
}