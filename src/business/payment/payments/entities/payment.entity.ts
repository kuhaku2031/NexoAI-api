import { PaymentsDetail } from 'src/business/payment/payments-details/entities/payments-detail.entity';
import { PointSale } from 'src/business/pos/point-sale/entities/point-sale.entity';
import { Sale } from 'src/business/sale/sales/entities/sale.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_amount: number;

  @ManyToOne(() => PointSale, (pointSale) => pointSale.sales)
  @JoinColumn({ name: 'point_sale' })
  point_sale: PointSale;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  paymentDetail: any[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @OneToOne(() => Sale, (sale) => sale.payment)
  @JoinColumn({ name: 'sale_id' })
  sale_id: number;

  @OneToMany(() => PaymentsDetail, (paymentsDetail) => paymentsDetail.payment)
  paymentsDetail: PaymentsDetail[];
}
