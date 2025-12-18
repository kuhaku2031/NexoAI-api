import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';

@Entity()
export class SalesDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  code: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  selling_price: number;

  @ManyToOne(() => Sale, (sale) => sale.salesDetail)
  @JoinColumn({ name: 'sale_id' })
  sale: number;

  @Column({ type: 'jsonb' })
  product: any;
}
