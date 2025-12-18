import { Sale } from 'src/business/sale/sales/entities/sale.entity';
import { Company } from 'src/core/companies/entities/company.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PointSale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => Sale, (sale) => sale.point_sale)
  sales: Sale;

  @ManyToOne(() => Company, (company) => company.point_sales)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // @OneToMany(() => WorkSession, (workSession) => workSession.point_sale)
  // work_sessions: WorkSession;
}
