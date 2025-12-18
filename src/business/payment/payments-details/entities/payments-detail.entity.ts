import { Payment } from 'src/business/payment/payments/entities/payment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaymentsDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payment_method: string;

  @Column()
  total_amount: number;

  @ManyToOne(() => Payment, (payment) => payment.paymentsDetail)
  @JoinColumn({ name: 'payment_id' })
  payment: number;
}
